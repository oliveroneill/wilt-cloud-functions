# wilt-cloud-functions
A collection of Google Cloud functions for querying Wilt data.

## Status
This function is replaced by a Firebase function within a Firebase project.
So the status of this project is now unmaintained.
See [here](https://github.com/oliveroneill/wilt-browser).

This relies on a BigQuery database setup via
[WiltCollector](https://github.com/oliveroneill/WiltCollector).
Unfortunately this is still using AWS Lambda, but it will populate the BigQuery
table as needed.

## Functions
- [playsPerArtist](https://github.com/oliveroneill/wilt-cloud-functions/tree/master/playsPerArtist)
