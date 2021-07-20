import { request } from "@octokit/request";

import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";

function displayRepoDetails(data) {
    let name = document.getElementById("repo-name");
    let description = document.getElementById("repo-description");
    let url = document.getElementById("repo-url");
    let stars = document.getElementById("repo-stars");
    let forks = document.getElementById("repo-forks");
    let homepage = document.getElementById("repo-homepage");

    name.innerHTML = data.name;
    description.innerHTML = data.description;
    url.href = data.html_url;
    url.innerHTML = data.html_url;
    stars.innerHTML = data.stargazers_count;
    forks.innerHTML = data.forks_count;
    homepage.src = data.homepage ? data.homepage : "";
}

async function getRepo(_id) {
    try {
        const result = await request("GET /repositories/{id}", {
            id: _id,
        });
        
        if(result.headers["x-ratelimit-remaining"] === "0") {
            console.log("Rate limit reached.");
            return;
        }

        displayRepoDetails(result.data);

    } catch (e) {
        console.log('error: ', e);
        if(e.message == "Not Found") {
            console.log('trying again...');
            getRandomRepo();
        } else if(e.message.includes("rate limit exceeded")) {
            const r = await request("GET /rate_limit");
            console.log("rate limit reached. reset at: ", new Date(r.data.rate.reset * 1000));
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomRepo() {
    let repo_id = getRandomInt(1, 387000000);
    console.log('trying repo id: ', repo_id);
    getRepo(repo_id).catch( e => {
        console.log('error: ', e);
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
    const btn = document.getElementById("repo-btn");
    btn.addEventListener("click", getRandomRepo, false);

    getRandomRepo();
})