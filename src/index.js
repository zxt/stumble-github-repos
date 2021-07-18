import { request } from "@octokit/request";

import "./styles.css";

async function getRepo(_id) {
    const result = await request("GET /repositories/{id}", {
        id: _id,
    });

    console.log(result);
}

getRepo(1);