#
#    Copyright 2019 Google LLC
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        https://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#

import sys
import json
import uuid

from googleapiclient import sample_tools
from googleapiclient.http import build_http

discovery_doc = "gmb_discovery.json"


def main(argv):
    # Use the discovery doc to build a service that we can use to make
    # MyBusiness API calls, and authenticate the user so we can access their
    # account
    service, flags = sample_tools.init(
        argv,
        "mybusiness",
        "v4",
        __doc__,
        __file__,
        scope="https://www.googleapis.com/auth/business.manage",
        discovery_filename=discovery_doc)

    # Get the list of accounts the authenticated user has access to
    accountsList = service.accounts().list().execute()
    print("List of Accounts:\n")
    print(json.dumps(accountsList, indent=2) + "\n")

    # Choose one account to work with. Change index below as needed
    randomAccount = accountsList["accounts"][8]["name"]

    locationBody = {
        "languageCode": "en",
        "storeCode": "256",
        "locationName": "Orchard Appartments",
        "primaryPhone": "+6595669895",
        "address": {
            "regionCode": "SG",
            "languageCode": "en",
            "postalCode": "238895",
            "addressLines": ["312 Orchard Rd"],
        },
        "primaryCategory": {
            "categoryId": "gcid:hotel"
        },
        "websiteUrl": "www.orchard-appartments.com",
    }

    randomRequestId = uuid.uuid1().hex
    # Get the list of locations for the first account in the list
    print("Using Account " + randomAccount)
    print("Using request id: " + randomRequestId)
    output = service.accounts().locations().create(
        parent=randomAccount,
        validateOnly=True,
        requestId=randomRequestId,
        body=locationBody).execute()
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main(sys.argv)
