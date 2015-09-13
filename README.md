as-this
====

Call a javascript function with ```this``` referred to the first argument

Primarily a syntactic sugar for CoffeeScript to replace long variable names with '@':


Install
----------
    npm install as-this


Usage
-----------
+ ### as (self, arg, arg2, .., fn)

  call function, return the `self` object:

  ```coffeescript
  as = require 'as-this'
  self = {}
  param = { name: 'World' }
  ret = as self, param, (arg) ->
    @msg = 'Hello, ' + arg.name
  # ret equals self equals { msg: 'Hello, World' }
  ```

+ ### as with promise support

  'self' object with be wrapped as promise if the function returns a promise:

  ```coffeescript
  as = require 'as-this'
  self = {}
  param = { name: 'World' }
  promise = as self, param, (arg) ->
    new Promise (resolve, reject) =>
      @msg = 'Hello, ' + arg.name
      resolve()
  promise.then (ret) ->
    # ret equals self equals { msg: 'Hello, World' }
  ```

  with co-yield style:

  ```coffeescript
  as = require 'as-this'
  co = require 'co'
  co ->
    self = {}
    param = { name: 'World' }
    ret = yield as self, param, (arg) -> co =>
      @msg = 'Hello, ' + arg.name
  # ret equals self equals { msg: 'Hello, World' }
  ```

+ ### as.call (self, arg, arg2, .., fn)

  directly return the return value from function

  ```coffeescript
  as = require 'as-this'
  scope = { act: 'Hello', name: 'World' }
  ret = as.call scope, ->
    "#{@act}, #{@name}"
  # ret equals 'Hello, World'
  ```

Scenario
---------

+ create object with interdependent properties

  ```coffeescript
  as = require 'as-this'
  urls = as {}, ->
    @base = "http://host:port"
    @main = "#{@base}/main"
    @list = "#{@base}/list"
    @odd = "#{@list}/odd"
    @even = "#{@list}/even"
    ...
  ```

  which is functionally equivalent to:

  ```coffeescript
  urls = do ->
    base = "http://host:port"
    list = "#{base}/list"
    {
      base: base
      main: "#{base}/main"
      list: list
      odd: "#{list}/odd"
      even: "#{list}/even"
    }
  ```

+ do complex configuration on a main scope object

  ```coffeescript
  as = require 'as-this'
  ng = require 'angular'

  as (ng.module 'myApp', []), ->

    @factory 'myServ', ($http) -> as {}, ->
      @load = (url) ->
        $http.get url
      @update = (url, data) ->
        $http.post url, data

    @controller 'myController', ($scope, myServ) -> as $scope, ->
      @doRefresh = ->
        myServ.load 'blahblah.json'
          .then (res) =>
            @data = res
      @doRefresh()
  ```

  which is functionally equivalent to:

  ```coffeescript
  as = require 'as-this'
  ng = require 'angular'

  myApp = ng.module 'myApp', []

  myApp.factory 'myServ', ($http) ->
    serv = {}
    serv.load = (url) ->
      $http.get url
    serv.update = (url, data) ->
      $http.post url, data
    return serv

  myApp.controller 'myController', ($scope, myServ) ->
    $scope.doRefresh = ->
      myServ.load 'blahblah.json'
        .then (res) =>
          $scope.data = res
    $scope.doRefresh()
  ```
