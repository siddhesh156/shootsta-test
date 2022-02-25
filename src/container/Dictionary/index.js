import axios from "axios";
import React, { useState } from "react";
import { Button, InputGroup, FormControl, Card } from "react-bootstrap";
import Loading from "../../component/Loading";
import "./index.css";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkValid, setCheckValid] = useState(false);

  const onHandleSearch = async () => {
    if (word !== "") {
      //unset word valid
      setCheckValid(false);
      //set loader
      setIsLoading(true);

      //Get data from API
      try {
        const response = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        //unset loader
        setIsLoading(false);
        let result = response?.data;
        //Setting data from API to the state
        setSearchData(result[0]?.meanings[0]?.definitions);
        setErrorMessage("");
      } catch (error) {
        //Error from API
        //unset loader
        setIsLoading(false);
        //Setting error from API to the state
        setErrorMessage(
          "Sorry pal, we couldn't find definitions for the word you were looking for. You can try another word."
        );
        setSearchData([]);
      }
    } else {
      //set word valid
      setCheckValid(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onHandleSearch();
    }
  };

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  return (
    <div className="main-container">
      <h1>Dictionary</h1>
      <InputGroup className="mb-3" hasValidation>
        <FormControl
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon1"
          value={word}
          required
          isInvalid={checkValid}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <FormControl.Feedback type="invalid" tooltip>
          Please enter a word.
        </FormControl.Feedback>
      </InputGroup>

      <Button
        variant="dark"
        style={{ alignSelf: "center", width: "70%" }}
        onClick={onHandleSearch}
      >
        Submit
      </Button>

      {isLoading ? (
        <div className="mt-5 d-f as-c">
          <Loading />
        </div>
      ) : (
        <>
          {searchData.length > 0 && (
            <div className="mt-5">
              <Card style={{ background: "#7c795d" }}>
                <Card.Body
                  style={{
                    color: "rgb(247, 154, 12)",
                    fontFamily: "Trocchi, serif",
                  }}
                >
                  <Card.Title style={{ textAlign: "center" }}>
                    Definitions
                  </Card.Title>
                  <ul>
                    {searchData.map((data, index) => {
                      let checkExample = data?.example !== undefined;
                      return (
                        <li key={index}>
                          {data.definition}
                          {checkExample
                            ? " For example " + data?.example
                            : null}
                        </li>
                      );
                    })}
                  </ul>
                </Card.Body>
              </Card>
            </div>
          )}

          {errorMessage !== "" ? (
            <div className="mt-5">
              <Card style={{ background: "#7c795d" }}>
                <Card.Body
                  style={{
                    color: "rgb(247, 154, 12)",
                    fontFamily: "Trocchi, serif",
                  }}
                >
                  <Card.Title style={{ textAlign: "center" }}>
                    {errorMessage}
                  </Card.Title>
                </Card.Body>
              </Card>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
export default Dictionary;
