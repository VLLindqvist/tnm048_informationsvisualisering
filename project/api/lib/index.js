"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var minimist_1 = __importDefault(require("minimist"));
var countries_1 = require("./handlers/countries");
var categories_1 = require("./handlers/categories");
var wines_1 = require("./handlers/wines");
var grapes_1 = require("./handlers/grapes");
var args = minimist_1.default(process.argv.slice(2));
var port = args.p || "3000";
var app = express_1.default();
// MIDDLEWARE
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// *** HANDLERS ***
app.get("/countries", countries_1.getCountries);
app.get("/countries/:countryName", countries_1.getCountry);
app.get("/categories", categories_1.getCategories);
app.get("/categories/:countryName", categories_1.getCategoriesPerCountry);
app.get("/grapes", grapes_1.getGrapes);
app.get("/wines", wines_1.getWines);
app.get("/wines/:countryName", wines_1.getWinesByCountry);
app.listen(port, function () {
    console.log("App is listening at http://localhost:" + port);
});
//# sourceMappingURL=index.js.map