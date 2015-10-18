as-this
====

Call a javascript function with ```this``` referred to the first argument

Primarily a syntactic sugar for CoffeeScript to replace long variable names with '@':


Install
----------
    npm install as-this


Usage
-----------
+ ### as (self, fn)

  call function, return the `self` object:

  ```coffeescript
  as = require 'as-this'
  self = {}
  ret = as self, ->
    @msg = 'Hello, World'
  console.log self  # => { msg: 'Hello, World' }
  console.log ret  # => { msg: 'Hello, World' }
  ```

+ ### as.call (self, fn)

  get the return value of `fn` instead of `self`:

  ```coffeescript
  as = require 'as-this'
  ret = as.call { msg: 'Hello, World' }, ->
    return @msg
  console.log ret  # => 'Hello, World'
  ```

+ ### omits self

  parameter `self` with be assigned to `{}` if not specified:

  ```coffeescript
  as = require 'as-this'
  ret = as ->
    @msg = 'Hello, World'
  console.log ret  # => { msg: 'Hello, World' }
  ```

+ ### defer with promise

  return value with be wrapped as promise if `fn` returns a promise:

  ```coffeescript
  as = require 'as-this'
  promise = as ->
    new Promise (resolve, reject) =>
      @msg = 'Hello, World'
      resolve()
  promise.then (ret) ->
    console.log ret  # => { msg: 'Hello, World' }
  ```

  use co-yield to clean your non-blocking code (not available in browser environment):

  ```coffeescript
  co = require 'co'
  as = require 'as-this'
  co ->
    ret = yield as -> co =>
      @msg = 'Hello, World'
    console.log ret  # => { msg: 'Hello, World' }
  ```

+ ### yieldables

  you may use generator function or thunk as `fn` value, they will be auto wrapped to promise:

  ```coffeescript
  co = require 'co'
  as = require 'as-this'
  co ->
    ret0 = as ->
      @type = 'general'
    ret1 = yield as -> co =>
      @type = 'non-args function returns a promise'
    ret2 = yield as ->
      @type = 'generator function'
      yield []
    ret3 = yield as (cb) ->
      @type = 'thunk'
      cb()
    console.log ret0  # => { type: 'general' }
    console.log ret1  # => { type: 'non-args function returns a promise' }
    console.log ret2  # => { type: 'generator function' }
    console.log ret3  # => { type: 'thunk' }
  ```


Scenario
---------

+ ### create object with interdependent properties

  ```coffeescript
  as = require 'as-this'
  urls = as ->
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
    return {
      base: base
      main: "#{base}/main"
      list: list
      odd: "#{list}/odd"
      even: "#{list}/even"
    }
  ```

+ ### do complex configuration on a specified object

  ```coffeescript
  as = require 'as-this'
  ng = require 'angular'

  as (ng.module 'myApp', []), ->

    @factory 'myServ', ($http) -> as ->
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
