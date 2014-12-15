jest.autoMockOff()
import '6to5/polyfill'
import '../__fixtures__/jasmine_matchers'

import {
  annotate,
  hasAnnotation,
  readAnnotations,
  Injector,
  Inject,
  InjectLazy,
  InjectPromise,
  Provide,
  ProvidePromise,
  TransientScope
} from '../index'

class UserList {}

annotate(fetchUsers2, new Provide(UserList))
function fetchUsers2() {
  return {}
}

// An async provider.
annotate(fetchUsers, new ProvidePromise(UserList))
function fetchUsers() {
  return Promise.resolve(new UserList)
}

class SynchronousUserList {}

class UserController {
  constructor(list) {
    this.list = list
  }
}
annotate(UserController, new Inject(UserList))

class SmartUserController {
  constructor(promise) {
    this.promise = promise
  }
}
annotate(SmartUserController, new InjectPromise(UserList))


describe('async', function() {

  // it('should return a promise', function() {
  //   var injector = new Injector([fetchUsers2])
  //   var p = injector.get(UserList)

  //   expect(p).toBePromiseLike()
  // })


  // it('should throw when instantiating promise provider synchronously', function() {
  //   var injector = new Injector([fetchUsers])

  //   expect(() => injector.get(UserList))
  //       .toThrowError('Cannot instantiate UserList synchronously. It is provided as a promise!')
  // })


  // it('should return promise even if the provider is sync', function() {
  //   var injector = new Injector()
  //   var p = injector.getPromise(SynchronousUserList)

  //   expect(p).toBePromiseLike()
  // })


  // regression
  // it('should return promise even if the provider is sync, from cache', function() {
  //   var injector = new Injector()
  //   var p1 = injector.getPromise(SynchronousUserList)
  //   var p2 = injector.getPromise(SynchronousUserList)

  //   expect(p2).toBePromiseLike()
  // })


  // it('should return promise when a dependency is async', function(done) {
  //   var injector = new Injector([fetchUsers])

  //   injector.getPromise(UserController).then(function(userController) {
  //     expect(userController).toBeInstanceOf(UserController)
  //     expect(userController.list).toBeInstanceOf(UserList)
  //     done()
  //   })
  // })


  // regression
  // it('should return a promise even from parent injector', function() {
  //   var injector = new Injector([SynchronousUserList])
  //   var childInjector = injector.createChild([])

  //   expect(childInjector.getPromise(SynchronousUserList)).toBePromiseLike()
  // })


  // it('should throw when a dependency is async', function() {
  //   var injector = new Injector([fetchUsers])

  //   expect(() => injector.get(UserController))
  //       .toThrowError('Cannot instantiate UserList synchronously. It is provided as a promise! (UserController -> UserList)')
  // })


  // it('should resolve synchronously when async dependency requested as a promise', function() {
  //   var injector = new Injector([fetchUsers])
  //   var controller = injector.get(SmartUserController)

  //   expect(controller).toBeInstanceOf(SmartUserController)
  //   expect(controller.promise).toBePromiseLike()
  // })


  // regression
  it('should not cache TransientScope', function(done) {

    class NeverCachedUserController {
      constructor(list) {
        this.list = list
      }
    }
    annotate(NeverCachedUserController, new TransientScope)
    annotate(NeverCachedUserController, new Inject(UserList))

    var injector = new Injector([fetchUsers])

    injector.getPromise(NeverCachedUserController).then(function(controller1) {
      injector.getPromise(NeverCachedUserController).then(function(controller2) {
        expect(controller1).not.toBe(controller2)
        done()
      })
    })
  })


  // it('should allow async dependency in a parent constructor', function(done) {
  //   class ChildUserController extends UserController {}

  //   var injector = new Injector([fetchUsers])

  //   injector.getPromise(ChildUserController).then(function(childUserController) {
  //     expect(childUserController).toBeInstanceOf(ChildUserController)
  //     expect(childUserController.list).toBeInstanceOf(UserList)
  //     done()
  //   })
  // })
})
