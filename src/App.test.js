import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
//import Enzyme from "enzyme";
//import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { fetchData } from "./util.js";

const axios = require("axios");
jest.mock("axios");

//Enzyme.configure({ adapter: new Adapter() });

test("renders Dictionary", () => {
  render(<App />);
  const linkElement = screen.getByText(/Dictionary/i);
  expect(linkElement).toBeInTheDocument();
});

describe("Search Dictionary", () => {
  test("Search Field Elements should be present", () => {
    render(<App />);
    const submitButton = screen.getByText(/Submit/i);

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });
});

describe("Search Dictionary Success", () => {
  test("User can search ", async () => {
    render(<App />);
    const mockedResponse = {
      definitions: {
        definition:
          "A mammal, Canis familiaris or Canis lupus familiaris, that has been domesticated for thousands of years, of highly variable appearance due to human breeding.",
        example: "The dog barked all night long.",
      },
    };

    axios.get.mockResolvedValue(mockedResponse);
    axios.get = jest.fn(() => mockedResponse);
    axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/dog");
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/dog"
    );
    expect(axios.get).toHaveReturnedWith(mockedResponse);
    await expect(fetchData("dog")).resolves.toEqual(mockedResponse);
  });
});

describe("Search Dictionary Error", () => {
  test("User can search ", async () => {
    render(<App />);
    const mockedResponse = {
      message:
        "Sorry pal, we couldn't find definitions for the word you were looking for. You can try another word.",
    };

    axios.get.mockResolvedValue(mockedResponse);
    axios.get = jest.fn(() => mockedResponse);
    axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/agf");
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/agf"
    );
    expect(axios.get).toHaveReturnedWith(mockedResponse);
    await expect(fetchData("agf")).resolves.toEqual(mockedResponse);
  });
});
