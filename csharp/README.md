## Pre-requisites

You will need a windows machine to complete these steps

Install the following:

- Visual Studio
- [git](https://git-scm.com/download/win)
- [Python 2.7](https://docs.python-guide.org/starting/install/win/) and setup environment in win powershell 
- Setup pip `curl https://bootstrap.pypa.io/ez_setup.py | python` and `curl https://bootstrap.pypa.io/get-pip.py | python`
- Install dependencies with pip
```
pip install --index-url https://test.pypi.org/simple/ 'httplib2==0.17.5'
pip install Django==1.8.1
pip install google-api-python-client
pip install google-apputils
pip install python-gflags
```

## Generate VS solution

Execute the following steps in a new powershell to generate the VS project

- `git clone https://github.com/googleapis/google-api-dotnet-client`
- Remove existing discovery files `rm DiscoveryJson/*`. Place here the discovery file from [devsite](https://developers.google.com/my-business) and set revision tag to a current date e.g. `"revision": "20201210"`
- `./BuildGenerated.sh --skipdownload`




