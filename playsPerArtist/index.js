const escapeHtml = require('escape-html');
const {BigQuery} = require('@google-cloud/bigquery');
const {projectId, bigQueryLocation} = require('./constants');

/**
 * Responds to an HTTP request using data from the request body parsed according
 * to the "content-type" header.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.playsPerArtist = (req, res) => {
  // CORS related stuff
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  // Check query parameters
  const user = req.query.user;
  if (user === undefined) {
    return res.status(400).send('Missing user parameter');
  }
  var start = req.query.start;
  if (start === undefined) {
    return res.status(400).send('Missing start parameter');
  }
  // The SQL query requires integers so we clamp values as needed
  start = Math.floor(start);
  var end = req.query.end;
  if (end === undefined) {
    return res.status(400).send('Missing end parameter');
  }
  // The SQL query requires integers so we clamp values as needed
  end = Math.ceil(end);
  // Set extract SQL query based on group by
  var extract;
  var interval = escapeHtml(req.query.group_by);
  switch (interval) {
    case 'day':
        extract = 'DAYOFYEAR';
        break;
    case 'week':
        extract = 'WEEK';
        break;
    case 'month':
        extract = 'MONTH';
        break;
    default:
        // Default to grouping by month
        extract = 'MONTH';
        interval = 'MONTH';
  }
  const bigQuery = new BigQuery({ projectId: projectId });
  const sqlQuery = `
  SELECT primary_artist, ARRAY_AGG(events) AS events FROM (
    SELECT
      period,
      primary_artist,
      SUM(count) AS events
    FROM (
      SELECT
        grouped.period,
        grouped.year,
        grouped.primary_artist,
        IFNULL(count, 0) AS count
      FROM (
        wilt_play_history.play_history
        CROSS JOIN (
          SELECT 1 AS count
        )
      )
      RIGHT JOIN (
        SELECT
          period_data.period,
          period_data.year,
          primary_artist
        FROM (
          SELECT
          DISTINCT primary_artist
          FROM wilt_play_history.play_history
          WHERE user_id='${user}' AND UNIX_SECONDS(date) BETWEEN ${start} AND ${end}
        ) as history
        CROSS JOIN (
          SELECT EXTRACT(${extract} FROM period) AS period, EXTRACT(YEAR FROM period) AS year
          FROM UNNEST(
              GENERATE_DATE_ARRAY(DATE(TIMESTAMP_SECONDS(${start})), DATE(TIMESTAMP_SECONDS(${end})), INTERVAL 1 ${interval})
          ) AS period
        ) AS period_data
      ) AS grouped ON EXTRACT(${extract} FROM play_history.date) = grouped.period AND EXTRACT(YEAR FROM play_history.date) = grouped.year AND grouped.primary_artist = play_history.primary_artist
    ) GROUP BY period, year, primary_artist ORDER BY period, year
  ) GROUP BY primary_artist`;

  bigQuery.query({
    query: sqlQuery,
    location: bigQueryLocation,
  }).then(function ([rows]) {
    return res.status(200).send(rows);
  }).catch(function (error) {
    return res.status(500).json(error.errors);
  });
};
