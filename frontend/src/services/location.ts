export const fetchLocationSuggestions = async (text: string) => {
  if (!text) return [];

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${
    import.meta.env.VITE_GEOAPIFY_API_KEY
  }`;

  const res = await fetch(url);
  const data = await res.json();
  console.log("data", data);
  return data.features || [];
};
