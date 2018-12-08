# playsPerArtist

Get plays per artist, grouped by periods.

## Getting Started
Create a `constants.js` file to store the Google Cloud Project ID and
BigQuery location. Like this:
```javascript
exports.projectId = 'ENTER-PROJECT-ID-HERE'
exports.bigQueryLocation = 'ENTER-LOCATION-HERE'
```

## Format
### Request
```bash
/playsPerArtist?user=${username}&start=${start}&end=${end}&group_by=${groupByTime}`;
```
`start` and `end` are unix timestamps in seconds, and `groupByTime` can be
one of these options:
- day
- week
- month

### Response
```javascript
[
    {
        "primary_artist": "Tyler, The Creator",
        "events": [0,0,1,0,0,0,0,0,0,0,6,0,0]
    },
    {
        "primary_artist": "Bon Iver",
        "events": [0,0,0,0,0,0,0,0,0,0,0,0,3]
    }
]
```
Each element in events will be a period based on `groupByTime`.

## Deploy:
```bash
gcloud beta functions deploy playsPerArtist --trigger-http --project $GOOGLE_CLOUD_PROJECT_ID
```
