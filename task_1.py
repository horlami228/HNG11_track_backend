from flask import *
from datetime import datetime, timedelta

app = Flask(__name__)

# validate the current UTC time(with validation of +/-2)
current_UTC_time = datetime.utcnow()
seconds = 2

lower = current_UTC_time - timedelta(seconds=2)
higher = current_UTC_time + timedelta(seconds=2)

if lower <= current_UTC_time and current_UTC_time <= higher:
    status_code = 200
else:
    status_code = 400

data_api = {
        "slack_name": "",
        "current_day": datetime.utcnow().strftime("%A"),
        "utc_time": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "track": "",
        "github_file_url": "https://github.com/horlami228/HNGx_track_backend/blob/master/task_1.py",
        "github_repo_url": "https://github.com/horlami228/HNGx_track_backend",
        "status_code": status_code
    }


@app.route("/", methods=["GET"])
def home_page():

    return jsonify(data_api)


@app.route("/api/", methods=["GET"])
def api():
    # get request query
    slack_name = request.args.get("slack_name", '')
    track = request.args.get("track", '')

    if slack_name:
        data_api["slack_name"] = slack_name
    if track:
        data_api["track"] = track
        
    return jsonify(data_api)


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
