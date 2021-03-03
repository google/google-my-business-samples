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

from googleapiclient import sample_tools
from googleapiclient.http import build_http


def main(argv):
    # Use the discovery doc to build a service that we can use to make
    # MyBusiness API calls, and authenticate the user so we can access their
    # account
    MyBusinessAccount, flags = sample_tools.init(argv, "mybusinessaccountmanagement", "v1", __doc__, __file__, scope="https://www.googleapis.com/auth/business.manage")

    # Get the list of accounts the authenticated user has access to
    output = MyBusinessAccount.accounts().list().execute()
    print("List of Accounts:\n")
    print(json.dumps(output, indent=2) + "\n")

if __name__ == "__main__":
  main(sys.argv)