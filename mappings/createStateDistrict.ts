import axios from "axios";
import headers from "../headerconfigs/requestHeaders.json";
import states from "./states.json";
import fs from 'fs'

const getDistricts = async () => {
  let finalMapping: any = states.map((state, i) => {
    return axios
      .get(
        "https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + (i + 1),
        {
          headers: headers,
        }
      )
      .then((respose: any) => {
        return { state: state, id: i + 1, districts: respose.data.districts };
      });
  });

  finalMapping = await Promise.all([...finalMapping]);
  finalMapping = finalMapping.map((r: any) =>r);

  fs.writeFileSync('states-districts.json',JSON.stringify(finalMapping))

};

getDistricts();
