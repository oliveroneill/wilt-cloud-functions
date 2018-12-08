# wilt-cloud-functions
A collection of Google Cloud functions for querying Wilt data.

This relies on a BigQuery database setup via
[WiltCollector](https://github.com/oliveroneill/WiltCollector).
Unfortunately this is still using AWS Lambda, but it will populate the BigQuery
table as needed.

## Functions
- [playsPerArtist](https://github.com/oliveroneill/wilt-cloud-functions/blob/master/playsPerArtist/README.md)
