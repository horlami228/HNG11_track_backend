from flask import *
from datetime import datetime, timedelta

app = Flask(__name__)
app.json.sort_keys = False

# validate the current UTC time(with validation of +/-2)
current_UTC_time = datetime.utcnow()
seconds = 2

lower = current_UTC_time - timedelta(seconds=2)
higher = current_UTC_time + timedelta(seconds=2)

if lower <= current_UTC_time and current_UTC_time <= higher:
    status_code = 200
else:
    status_code = 400



@app.route("/", methods=["GET"])
def home_page():
    time = current_UTC_time.isoformat()[:-7] + 'Z'
    day = current_UTC_time.strftime("%A")

    data_api = {
        "slack_name": "",
        "current_day": day,
        "utc_time": time,
        "track": "",
        "github_file_url": "https://github.com/horlami228/HNGx_track_backend/blob/master/task_1.py",
        "github_repo_url": "https://github.com/horlami228/HNGx_track_backend",
        "status_code": status_code
    }
    
    return jsonify(data_api)


@app.route("/api/", methods=["GET"])
def api():
    time = current_UTC_time.isoformat()[:-7] + 'Z'
    day = current_UTC_time.strftime("%A")

    data_api = {
        "slack_name": "",
        "current_day": day,
        "utc_time": time,
        "track": "",
        "github_file_url": "https://github.com/horlami228/HNGx_track_backend/blob/master/task_1.py",
        "github_repo_url": "https://github.com/horlami228/HNGx_track_backend",
        "status_code": status_code
    }  
    
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

# # Get the current UTC time
# current_utc_time = datetime.utcnow()

# # Define the Nigeria time zone
# nigeria_timezone = pytz.timezone("Africa/Lagos")

# # Convert the current UTC time to the Nigeria time zone
# lagos_time = current_utc_time.replace(tzinfo=pytz.UTC).astimezone(nigeria_timezone)

# # Format the Lagos time as an ISO 8601 string with "Z" for UTC
# iso_formatted = lagos_time.strftime("%Y-%m-%dT%H:%M:%SZ")

# # Print the ISO formatted Lagos time
# print("Current Lagos Time:", iso_formatted)