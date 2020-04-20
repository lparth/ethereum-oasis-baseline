import db from './db';
import startServer from './app';
import { loadServerSettingsFromFile } from './utils/serverSettings';
import { subscribeRegisterOrgEvent } from './services/event';
import { saveOrganizations } from './services/organization';
import { startEventFilter } from './services/merkle-tree';

const main = async () => {
  try {
    // Setup
    await db.connect();
    await db.connectMongoose();

    try {
      await loadServerSettingsFromFile();
    } catch (err) {
      console.log('caught exception during loadServerSettingsFromFile()');
      console.log(err);
    }
  
    // Healthcheck
    startServer();

    // Sanity Check
    try {
      await saveOrganizations();
    } catch (err) {
      console.log('caught exception during saveOrganizations()');
      console.log(err);
    }

    try {
      await subscribeRegisterOrgEvent();
    } catch (err) {
      console.log('caught exception during subscribeRegisterOrgEvent()');
      console.log(err);
    }

    try {
      // filter for NewLeaves in the shield contract:
      await startEventFilter();
    } catch (err) {
      console.log('caught exception during startEventFilter()');
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

main();
