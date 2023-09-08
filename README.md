# Backend Stage One Task

## Objective
Create and host an endpoint using any programming language of your choice.
The endpoint should take two GET request query parameters and return specific information in JSON format.

## Requirements

> The information includes:
* Slack name
* Current day of the week
* Current UTC time (with validation of +/-2)
* Track
* The GitHub URL of the file being run
* The GitHub URL of the full source code
* A Staus Code of Success

<h3>Result in JSON</h3>

<pre>
{
    "current_day": "Friday",
    "github_file_url": "https://github.com/horlami228/		HNGx_track_backend/blob/master/task_1.py",
    "github_repo_url": "https://github.com/horlami228/HNGx_track_backend",
    "slack_name": "olamilekan",
    "status_code": 200,
    "track": "backend",
    "utc_time": "2023-09-08T00:50:47Z"
}
</pre>