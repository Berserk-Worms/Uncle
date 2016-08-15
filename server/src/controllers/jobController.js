import Job from '../models/jobModel';
import rp from 'request-promise';

//Post method for the api route /api/job
const addJob = (req, res) => {
  let jobData = req.body.jobData;
  let tagsData = req.body.tagsData;
  //Find or create job
  //jobData is in the following structure 
  //jobData = {
  //  title: item['title'],
  //  link: item['permalink'],
  //  location: item['rss:location']['#'],
  //  company: item['a10:author']['a10:name']['#'],
  //  publishDate: item['pubDate']
  //}
  Job.findOrCreate({ where: jobData })
  .spread( (job, created) => {
    //Create tags if it's a new job
    if (created) {
      console.log('created new job', job.dataValues.title);
      return rp({
        url: 'http://localhost:8080/api/tags/job',
        method: 'POST',
        json: { job, tagsData }
      });
    } else {
      console.log('we already have that job in the database');
      res.end();
    }
  })
  .then(() => {
    res.end();
  })
  .catch((err) => {
    console.log('error creating job', err);
  });
}

export default { addJob }
