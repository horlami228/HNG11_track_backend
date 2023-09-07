from flask import *
import json
from datetime import datetime, timedelta

app = Flask("Olamilekan")

# validate the current UTC time(with validation of +/-2)
current_UTC_time = datetime.utcnow()

reserved_UTC_time = datetime.utcnow()

seconds = 2

lower = current_UTC_time - timedelta(seconds=2)
higher = reserved_UTC_time + timedelta(seconds=2)

if lower <= current_UTC_time and current_UTC_time <= higher:
    print("Time is validated")
else:
    print("not validatated")
    exit(98)


@app.route("/", methods=["GET"])
def home_page():
    # get request query
    slack_name = request.args.get("slack_name")
    track = request.args.get("track")
    
    data_api = {
        "slack_name": f"{slack_name}",
        "current_day": current_UTC_time.strftime("%A"),
        "utc_time": current_UTC_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "track": f"{track}",
        "github_file_url": "https://github.com/horlami228/HNGx_track_backend\
            /blob/master/task_1.py",
        "github_repo_url": "https://github.com/horlami228/HNGx_track_backend",
        "status_code": 200
    }

    json_file = json.dumps(data_api)
    return json_file, data_api["status_code"]


if __name__ == "__main__":
    app.run(debug=True)
