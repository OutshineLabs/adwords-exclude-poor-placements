/**
 * Removes placements ending in the tlds xyz, info, and tk.
 * @author Dawson Reid
 * @author Andrew Breen
 */

// Top Level Domains to exclude

const TLDs = '.xyz, .info, .tk';

const WHITELIST_LABEL = 'Exclude Poor Placements';

// -------------------------------------------------------

function removePlacementByDomain (domain) {
  const placementSelector = AdWordsApp.display().placements()
  .withCondition("PlacementUrl CONTAINS '" + domain + "'");

  const placementIterator = placementSelector.get();
  while (placementIterator.hasNext()) {
    const placement = placementIterator.next();
    const placementUrl = placement.getUrl();
    //Logger.log(placementUrl);

    const campaign = placement.getCampaign();
    if (!campaign.isRemoved()) {
      const excludeOperation = campaign.display().newPlacementBuilder().withUrl(placementUrl).exclude();
      if (!excludeOperation.isSuccessful()) {
        Logger.log("Could not exclude : " + placementUrl);
      }
    }
  }
}

function run () {
  TLDs.split(',').map(function (tld) {
    return tld.trim();
  }).forEach(function (domain) {
    removePlacementByDomain(domain);
  });
}

function executeInSequence (sequentialIds, executeSequentiallyFunc) {
  Logger.log('Executing in sequence : ' + sequentialIds);
  sequentialIds.forEach(function (accountId) {
    const account = MccApp.accounts().withIds([accountId]).get().next();
    MccApp.select(account);
    executeSequentiallyFunc();
  });
}

function main () {
  try {
    const accountIterator = MccApp.accounts()
      .withCondition(`LabelNames CONTAINS '${WHITELIST_LABEL}'`)
      .orderBy('Name')
      .get();
    // map account entities to
    const accountIds = [];
    while (accountIterator.hasNext()) {
      const account = accountIterator.next();
      accountIds.push(account.getCustomerId());
    }
    const parallelIds = accountIds.slice(0, 50);
    const sequentialIds = accountIds.slice(50);
    // execute accross accounts
    MccApp.accounts()
      .withIds(parallelIds)
      .executeInParallel('run');
    if (sequentialIds.length > 0) {
      executeInSequence(sequentialIds, run);
    }
  } catch (exception) {
    // not an Mcc
    Logger.log('Running on non-MCC account.');
    run();
  }
}
