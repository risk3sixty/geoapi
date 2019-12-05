# [risk3sixty](https://risk3sixty.com)

## geoip

Lightweight API service to get geolocation data from IP addresses.

### Usage

Simply make a GET request to the geoapi endpoint with the IP
address located in the route of the URL.

```sh
# https://geo.phalanx.risk3sixty.com/IPV4_OR_IPV6_IP_ADDRESS

$ curl https://geo.phalanx.risk3sixty.com/128.61.0.0
{"range":[2151481344,2151546879],"country":"US","region":"GA","eu":"0","timezone":"America/New_York","city":"Atlanta","ll":[33.7746,-84.3973],"metro":524,"area":5}

$ curl https://geo.phalanx.risk3sixty.com/2001:468:300:0:0:0:0:0
{"range":"","country":"US","region":"","city":"","ll":[37.751,-97.822],"metro":0,"area":100,"eu":"0","timezone":"America/Chicago"}
```

### Development

```sh
$ git clone https://github.com/Risk3sixty-Labs/geoapi
$ cd geoapi
$ npm install

# build production files
$ gulp build

# start server
$ npm start
```