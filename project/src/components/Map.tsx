import { Feature, Geometry } from "geojson";
import { Layer } from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON as GeoJSONComponent,
  Marker,
  SVGOverlay,
  Tooltip,
  Rectangle,
} from "react-leaflet";
import Leaflet from "leaflet";

import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import countriesJSON from "../json/countries_translated.json";
import { setCountry } from "../redux/country";
import { Countries } from "../types";
import { getFetcher } from "../utils/fetchers";

const corner1 = Leaflet.latLng(-89.98155760646617, -180);
const corner2 = Leaflet.latLng(89.98155760646617, 180);
const bounds = Leaflet.latLngBounds(corner1, corner2);

const Map = () => {
  const dispatch = useDispatch();
  const country = useSelector((state: RootStateOrAny) => state.country);

  const geoJSONRef = useRef<any>();
  const map = useRef<any>();

  const [countriesFeatureLayer, setCountriesFeatureLayer] = useState<
    { feature: Feature<Geometry, any>; layer: Layer }[]
  >([]);

  const { data: countries, error: countriesFetchError } = useSWR<Countries>(
    `/countries`,
    (url: string) => getFetcher<Countries>(url),
  );

  useEffect(() => {
    if (geoJSONRef.current) {
      if (country.current.event) {
        country.current.event.target.setStyle({
          fillColor: "#b33232",
        });
      }
      if (country.old.event) {
        country.old.event.target.setStyle({
          fillColor: "#ccc",
        });
        if (!country.current.event) {
          map.current._map.setView([15, 0], 2);
        }
      }
    }
  }, [country]);

  if (countries) {
    return (
      <MapContainer
        center={[15, 0]}
        zoom={2}
        maxBoundsViscosity={1.0}
        maxBounds={bounds}
        maxZoom={5}
        minZoom={2}
        style={{ backgroundColor: "#162131" }}
      >
        <TileLayer
          ref={map}
          // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url=""
          // url="https://api.mapbox.com/styles/v1/victorlindqvist/cklr436aj059a17ptz60up6jb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmljdG9ybGluZHF2aXN0IiwiYSI6ImNrbHF2eTRhMTFncmMydnFyZ2g3b2k5MWoifQ.PTW8jmTp7eOvd69e-6TFfw"
          detectRetina
        />
        <GeoJSONComponent
          ref={geoJSONRef}
          data={countriesJSON as any}
          style={(geojsonfeature) => {
            if (
              geojsonfeature &&
              Object.keys(countries).includes(
                geojsonfeature.properties.name_translation,
              )
            ) {
              return {
                fillColor: "#ccc",
                weight: 0.5,
                color: "#f7dede",
                fillOpacity: 0.2,
              };
            } else {
              return {
                fillColor: "#222",
                weight: 0.2,
                color: "#444",
                fillOpacity: 0.2,
              };
            }
          }}
          onEachFeature={(feature: Feature<Geometry, any>, layer: Layer) => {
            if (
              feature &&
              Object.keys(countries).includes(
                feature.properties.name_translation,
              )
            ) {
              if (
                !countriesFeatureLayer.filter(
                  ({ feature: f }) =>
                    f.properties.name_translation ===
                    feature.properties.name_translation,
                ).length
              ) {
                setCountriesFeatureLayer([
                  ...countriesFeatureLayer,
                  { feature, layer },
                ]);
              }

              layer.on({
                mouseover: (event) => {
                  event.target.setStyle({
                    weight: 1,
                    fillOpacity: 0.7,
                  });
                },
                mouseout: (event) => {
                  event.target.setStyle({
                    weight: 0.5,
                    fillOpacity: 0.2,
                  });
                },
                click: (event) => {
                  dispatch(
                    setCountry({
                      name:
                        event.sourceTarget.feature.properties.name_translation,
                      event,
                    }),
                  );
                  map.current._map.fitBounds(event.sourceTarget.getBounds());
                },
              });
            }
          }}
        />
      </MapContainer>
    );
  }

  return <div />; // TODO: Spinner
};

export default Map;
