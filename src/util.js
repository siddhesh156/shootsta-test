import axios from 'axios';

export const fetchData = async query => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;
   let response = await axios.get(url)
  return response;
};
