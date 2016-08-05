/**
 * Removes placements ending in the tlds xyz, info, and tk.
 * @author Dawson Reid
 * @author Andrew Breen
 */

// Top Level Domains to exclude

const TLDs = '.xyz, .info, .tk';

const USE_WHITELIST = true;
const WHITELIST_COLUMN_NAME = 'Exclude Poor Placement';
const WHITELIST_SPREADSHEET = '1C_ZcxNm_Tx_NQrHF_DK4eYcmf-O1tH0HpiirBROyFd4';

// -------------------------------------------------------

function removePlacementByDomain (domain) {
  var placementSelector = AdWordsApp.display().placements()
  .withCondition("PlacementUrl CONTAINS '" + domain + "'");

  var placementIterator = placementSelector.get();
  while (placementIterator.hasNext()) {
    var placement = placementIterator.next();
    var placementUrl = placement.getUrl();
    //Logger.log(placementUrl);

    var campaign = placement.getCampaign();
    if (!campaign.isRemoved()) {
      var excludeOperation = campaign.display().newPlacementBuilder().withUrl(placementUrl).exclude();
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
    var account = MccApp.accounts().withIds([accountId]).get().next();
    MccApp.select(account);
    executeSequentiallyFunc();
  });
}

function main () {
  try {
    var accountSelector = MccApp.accounts().orderBy('Name');
    if (USE_WHITELIST) {

    } else {
      Logger.log("WARNING : Executing accross all accounts. It is recommended that you explicitly specify the accounts to execute on via a whitelist.");
    }
    var accountIterator = accountSelector.get();
    Logger.log('Executing accross ' + accountIterator);

    var accountIds = [];
    while (accountIterator.hasNext()) {
      var account = accountIterator.next();
      accountIds.push(account.getCustomerId());
    }
    var parallelIds = accountIds.slice(0, 50);
    var sequentialIds = accountIds.slice(50);
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
