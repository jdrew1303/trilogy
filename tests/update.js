import Trilogy from '../dist/trilogy'

import test from 'ava'
import { remove } from 'fs-jetpack'
import { join, basename } from 'path'

const filePath = join(__dirname, `${basename(__filename, '.js')}.db`)
const db = new Trilogy(filePath)

test.before(async () => {
  await db.model('one', {
    first: String,
    second: String,
    third: Boolean,
    array: Array
  })

  await Promise.all([
    db.create('one', {
      first: 'fee',
      second: 'blah'
    }),
    db.create('one', {
      third: false,
      array: [1, 2, 3]
    })
  ])
})

test.after.always('remove test database file', () => {
  return db.close().then(() => remove(filePath))
})

test('changes the value of an existing key', async t => {
  await db.update('one', { first: 'fee' }, { second: 'blurg' })
  let res = await db.get('one.second', { first: 'fee' })
  t.is(res, 'blurg')
})

test('handles model type definitons correctly', async t => {
  await db.update('one', { third: false }, { array: [4, 5, 6] })
  let res = await db.get('one.array', { third: false })
  t.deepEqual(res, [4, 5, 6])
})
