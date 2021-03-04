export const getFetcher = async <T extends unknown>(
  url: string,
): Promise<T> => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}${url}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};
