as-this
====

Call a javascript function with ```this``` referred to the first argument

Primarily a syntactic sugar for CoffeeScript:


Install
----------
    npm install as-this


Usage
-----------
+ ### as (self, arg, arg2, .., fn)

  call function, return the `self` object:

  ```coffeescript
  as = require 'as-this'
  self = as {}, 'World', (name) ->
    @hello = name
    ...
  # self is { hello: 'World'}
  ```

+ ### as.call (self, arg, arg2, .., fn)

  call function, return the return value from function

  ```coffeescript
  as = require 'as-this'
  ret = as { hello: 'Hello'}, 'World', (name) ->
    "#{@hello}, #{name}"
    ...
  # ret is 'Hello, World'
  ```


Scenario
---------

+ ** use as to create object with interdependent properties **

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

+ ** use as.call to yield promised function with given scope **

  ```coffeescript
  co = require 'co'
  as = require 'as-this'

  # count all and query first 30 records from monogdb collection
  co ->
    collec = mongodb.collection 'record'
    result = yield as.call collec, { type: 'marked' }, (condi) -> co =>
      cursor = @find condi, {}, { limit: 30 }
      {
        count: yield @count condi
        records: yield cursor.toArray()
      }
  ```
