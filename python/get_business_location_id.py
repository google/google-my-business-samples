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
1. Install Google API Client Discovery
python -m pip install google-api-python-client
2. Get your Google Cloud Platform (GCP) project approved.
Fill out this form:
https://docs.google.com/forms/d/1XTQc-QEjsE7YrgstyJxbFDnwmhUhBFFvpNJBw3VzuuE/viewform  
Find out more information here:
https://developers.google.com/my-business/content/prereqs
3. In that approved project, you need to enable two APIs:
My Business Business Information API. There isn’t a typo; ‘business’ is repeated twice.
My Business Account Management API
4. Get a refresh token from a user's Google account with the following scope:
'https://www.googleapis.com/auth/business.manage'
'''
import os

from googleapiclient.discovery import build
import google.oauth2.credentials

def business_profile(refresh_token):

    try:
        '''
        Step 1 - Configurations
        '''
        # env variables
        GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
        GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)

        # documentation that explains the fields of the credentials
        # https://google-auth.readthedocs.io/en/stable/reference/google.oauth2.credentials.html
        credentials = {
            'refresh_token': refresh_token,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'token': None,
            'token_uri': "https://oauth2.googleapis.com/token"
        }

        # build the credentials object
        google_credentials = google.oauth2.credentials.Credentials(**credentials)

        '''
        Step 2 - Get the account information using the Account Managment API
        https://developers.google.com/my-business/reference/accountmanagement/rest
        '''
        # start the service
        service = build(
            'mybusinessaccountmanagement',      # serviceName
            'v1',                               # version
            credentials=google_credentials      # user's credentials
            )
        
        # build the request to accounts using list method
        request = service.accounts().list()

        # execute the request and print the result
        result = request.execute()
        print("result:")
        print(result)
        account = result['accounts'][0]['name']
        print("account:")
        print(account)

        '''
        Step 3 - Get the business information using the Business Information API
        https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations/list
        '''
        # start the service
        service = build(
            'mybusinessbusinessinformation',    # serviceName
            'v1',                               # version
            credentials=google_credentials      # user's credentials
            )

        # set the fields you want to get of the Business Information profile
        # follow the link below to see all the fields you can get
        # https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations#Location
        fields_we_want = 'name,title,websiteUri,languageCode,phoneNumbers'

        # build the request to accounts.locations using list method
        request = service.accounts().locations().list(
            parent=account,
            readMask=fields_we_want
            )

        # execute the request and print the result
        result = request.execute()
        print("result:")
        print(result)

        # get the business_location_id
        business_location_id = result['locations'][0]['name'].split('/')[1]
        print("business_location_id:")
        print(business_location_id)

        return business_location_id

    except:
        print('There was an error trying to get Business Information.')
        