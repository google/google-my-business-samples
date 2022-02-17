# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
'''
This is an example to get the business_location_id of a user's Business Profile.
This is used to create Smart Campaigns, an advertising type in Google Ads.

Prerequisites:
1. Get your Google Cloud Platform (GCP) project approved.
Fill out this form:
https://docs.google.com/forms/d/1XTQc-QEjsE7YrgstyJxbFDnwmhUhBFFvpNJBw3VzuuE/viewform  
Find out more information here:
https://developers.google.com/my-business/content/prereqs
2. In that approved project, you need to enable two APIs:
My Business Business Information API. There isn’t a typo; ‘business’ is repeated twice.
My Business Account Management API
'''
import sys

from googleapiclient import sample_tools

def main(argv):

    try:
        '''
        Step 1 - Configurations
        '''
        # Use the discovery doc to build two services that we can use to make
        # MyBusiness API (aka Business Profile API) calls, 
        # and authenticate the user so we can access their account
        MyBusinessAccount, flags = sample_tools.init(argv, "mybusinessaccountmanagement", "v1", __doc__, __file__, scope="https://www.googleapis.com/auth/business.manage")
        MyBusinessInformation, flags = sample_tools.init(argv, "mybusinessbusinessinformation", "v1", __doc__, __file__, scope="https://www.googleapis.com/auth/business.manage")

        '''
        Step 2 - Get the account information using the Account Managment API
        https://developers.google.com/my-business/reference/accountmanagement/rest
        '''
        # Build the request to accounts using list method
        request = MyBusinessAccount.accounts().list()

        # Execute the request and print the result
        accounts_result = request.execute()
        print("accounts_result:")
        print(accounts_result)
        account_resource_name = accounts_result['accounts'][0]['name']
        print("account_resource_name:")
        print(account_resource_name)

        '''
        Step 3 - Get the business information using the Business Information API
        This example gets the business_location_id, but you can also get more information.
        Below is the link to the Business Information API
        https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations/list
        Below is the link to see the fields you can get using this API
        https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations#Location
        '''
        # List the fields you want to get, separated by a comma
        # For example: 'name,title,websiteUri,languageCode,phoneNumbers'
        fields_we_want = 'name'

        # Build the request to accounts.locations using list method
        request = MyBusinessInformation.accounts().locations().list(
            parent=account_resource_name,
            readMask=fields_we_want
            )

        # Execute the request and print the result
        locations_result = request.execute()
        print("locations_result:")
        print(locations_result)

        # Get the business_location_id
        if locations_result:
            business_location_id = locations_result['locations'][0]['name'].split('/')[1]
            print("business_location_id:")
            print(business_location_id)

        return business_location_id

    except:
        print('There was an error trying to get Business Information.')

if __name__ == "__main__":
  main(sys.argv)
        