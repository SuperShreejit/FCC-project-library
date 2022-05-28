/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/
// https://github.com/SuperShreejit/FCC-project-library
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const booksRoute = '/api/books';
const idRegex = /^\w{24}$/;

suite('Functional Tests', function() {
	/*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
	/*
  test('#example Test GET /api/books', function(done) {
		chai
			.request(server)
			.get('/api/books')
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.isArray(res.body, 'response should be an array');
				assert.property(
					res.body[0],
					'commentcount',
					'Books in array should contain commentcount'
				);
				assert.property(
					res.body[0],
					'title',
					'Books in array should contain title'
				);
				assert.property(
					res.body[0],
					'_id',
					'Books in array should contain _id'
				);
				done();
			});
	}); */
	/*
  * ----[END of EXAMPLE TEST]----
  */

	suite('Routing tests', function() {
		suite(
			'POST /api/books with title => create book object/expect book object',
			function() {
				test('Test POST /api/books with title', function(done) {
					const request = { title: 'test_title' };
					chai
						.request(server)
						.post(booksRoute)
						.send(request)
						.end((err, res) => {
							assert.isNull(err, 'there should be no errors');
							assert.equal(
								res.status,
								200,
								'Must be a successful request of status 200'
							);
							const body = res.body;
							const { _id, title, commentcount, comments } = body;
							assert.equal(
								res.type,
								'application/json',
								'response type must be json'
							);
							assert.isObject(body, 'Response body must be an object');
							assert.property(body, '_id', 'book must have an id');
							assert.isString(_id, 'book id must be a string');
							assert.match(
								_id,
								idRegex,
								'book id must be 24-character hexadeimal string provided by mongoDB'
							);
							assert.property(body, 'title', 'book must have a title');
							assert.isString(title, 'title must be a string');
							assert.equal(
								title,
								request.title,
								'title must be the title provided in the request'
							);
							assert.property(
								body,
								'commentcount',
								'book must have a comments count'
							);
							assert.isNumber(commentcount, 'comments count must be a number');
							assert.equal(
								commentcount,
								0,
								'comments count must be initialized to zero'
							);
							assert.property(body, 'comments', 'book must have comments');
							assert.isArray(comments, 'comments must be an array');
							if (comments.length > 0)
								comments.forEach(comment =>
									assert.isString(comment, 'Every comment must be a String')
								);
							done();
						});
				});

				test('Test POST /api/books with no title given', function(done) {
					const request = {};
					chai
						.request(server)
						.post(booksRoute)
						.send(request)
						.end((err, res) => {
							assert.isNull(err, 'there should be no errors');
							assert.equal(
								res.status,
								200,
								'Must be a successful request of status 200'
							);
							assert.equal(
								res.type,
								'text/html',
								'Response type must be plain text'
							);
							assert.isString(res.text, 'Response must be a string');
							assert.equal(
								res.text,
								'missing required field title',
								`Error received must be 'missing required field title'`
							);
							done();
						});
				});
			}
		);

		suite('GET /api/books => array of books', function() {
			test('Test GET /api/books', function(done) {
				chai
					.request(server)
					.get(booksRoute)
					.end((err, res) => {
						assert.isNull(err, 'there should be no errors');
						assert.equal(
							res.status,
							200,
							'Must be a successful request of status 200'
						);
						const body = res.body;
						assert.equal(
							res.type,
							'application/json',
							'response type must be json'
						);
						assert.isArray(body, 'Response body must be an array');
						if (body.length > 0)
							body.forEach(book => {
								assert.isObject(book, 'Response body must be an object');
								assert.property(book, '_id', 'book must have an id');
								assert.isString(book._id, 'book id must be a string');
								assert.match(
									book._id,
									idRegex,
									'book id must be 24-character hexadeimal string provided by mongoDB'
								);
								assert.property(book, 'title', 'book must have a title');
								assert.isString(book.title, 'title must be a string');
								assert.property(
									book,
									'commentcount',
									'book must have a comments count'
								);
								assert.isNumber(
									book.commentcount,
									'comments count must be a number'
								);
								assert.property(book, 'comments', 'book must have comments');
								assert.isArray(book.comments, 'comments must be an array');
								if (book.comments.length > 0)
									book.comments.forEach(comment =>
										assert.isString(comment, 'Every comment must be a String')
									);
							});
						done();
					});
			});
		});

		suite('GET /api/books/[id] => book object with [id]', function() {
			test('Test GET /api/books/[id] with id not in db', function(done) {
				const id = 'id-not-in-db';
				chai
					.request(server)
					.get(`${booksRoute}\\${id}`)
					.end((err, res) => {
						assert.isNull(err, 'there should be no errors');
						assert.equal(
							res.status,
							200,
							'Must be a successful request of status 200'
						);
						assert.equal(
							res.type,
							'text/html',
							'Response type must be plain text'
						);
						assert.isString(res.text, 'Response must be a string');
						assert.equal(
							res.text,
							'no book exists',
							`Error received must be 'no book exists'`
						);
						done();
					});
			});

			test('Test GET /api/books/[id] with valid id in db', function(done) {
				const request = { title: 'test_title2' };
				chai
					.request(server)
					.post(booksRoute)
					.send(request)
					.end((err, res) => {
						assert.isNull(err, 'there should be no errors');
						assert.equal(
							res.status,
							200,
							'Must be a successful request of status 200'
						);

						const id = res.body._id;
						chai
							.request(server)
							.get(`${booksRoute}\\${id}`)
							.end((err, res) => {
								assert.isNull(err, 'there should be no errors');
								assert.equal(
									res.status,
									200,
									'Must be a successful request of status 200'
								);
								assert.equal(
									res.type,
									'application/json',
									'the response type must be json'
								);
								assert.isObject(
									res.body,
									'The response body must be an Object'
								);
								assert.equal(
									res.body._id,
									id,
									'posted id must match with the found book id'
								);
								const book = res.body;
								assert.isObject(book, 'Response body must be an object');
								assert.property(book, '_id', 'book must have an id');
								assert.isString(book._id, 'book id must be a string');
								assert.match(
									book._id,
									idRegex,
									'book id must be 24-character hexadeimal string provided by mongoDB'
								);
								assert.property(book, 'title', 'book must have a title');
								assert.isString(book.title, 'title must be a string');
								assert.property(
									book,
									'commentcount',
									'book must have a comments count'
								);
								assert.isNumber(
									book.commentcount,
									'comments count must be a number'
								);
								assert.property(book, 'comments', 'book must have comments');
								assert.isArray(book.comments, 'comments must be an array');
								if (book.comments.length > 0)
									book.comments.forEach(comment =>
										assert.isString(comment, 'Every comment must be a String')
									);
								done();
							});
					});
			});
		});

		suite(
			'POST /api/books/[id] => add comment/expect book object with id',
			function() {
				test('Test POST /api/books/[id] with comment', function(done) {
					const requestBook = { title: 'test_title3' };
					chai
						.request(server)
						.post(booksRoute)
						.send(requestBook)
						.end((err, res) => {
							assert.isNull(err, 'there should be no errors');
							assert.equal(
								res.status,
								200,
								'Must be a successful request of status 200'
							);

							const id = res.body._id;
							const commentcount = res.body.commentcount;
							const request = { comment: 'test_comment' };
							chai
								.request(server)
								.post(`${booksRoute}\\${id}`)
								.send(request)
								.end((err, res) => {
									assert.isNull(err, 'there should be no errors');
									assert.equal(
										res.status,
										200,
										'Must be a successful request of status 200'
									);
									assert.equal(
										res.type,
										'application/json',
										'the response type must be json'
									);
									assert.isObject(
										res.body,
										'The response body must be an Object'
									);
									assert.equal(
										res.body._id,
										id,
										'posted id must match with the found book id'
									);
									const getComment = res.body.comments.find(
										comment => comment === request.comment
									);
									assert.isOk(
										getComment,
										'The posted comment must be in the book comments'
									);
									assert.strictEqual(
										res.body.commentcount,
										commentcount + 1,
										'The new comment count must be updated'
									);
									const book = res.body;
									assert.isObject(book, 'Response body must be an object');
									assert.property(book, '_id', 'book must have an id');
									assert.isString(book._id, 'book id must be a string');
									assert.match(
										book._id,
										idRegex,
										'book id must be 24-character hexadeimal string provided by mongoDB'
									);
									assert.property(book, 'title', 'book must have a title');
									assert.isString(book.title, 'title must be a string');
									assert.property(
										book,
										'commentcount',
										'book must have a comments count'
									);
									assert.isNumber(
										book.commentcount,
										'comments count must be a number'
									);
									assert.property(book, 'comments', 'book must have comments');
									assert.isArray(book.comments, 'comments must be an array');
									if (book.comments.length > 0)
										book.comments.forEach(comment =>
											assert.isString(comment, 'Every comment must be a String')
										);
									done();
								});
						});
				});

				test('Test POST /api/books/[id] without comment field', function(done) {
					const requestBook = { title: 'test_title4' };
					chai
						.request(server)
						.post(booksRoute)
						.send(requestBook)
						.end((err, res) => {
							assert.isNull(err, 'there should be no errors');
							assert.equal(
								res.status,
								200,
								'Must be a successful request of status 200'
							);

							const id = res.body._id;
							const request = {};
							chai
								.request(server)
								.post(`${booksRoute}\\${id}`)
								.send(request)
								.end((err, res) => {
									assert.isNull(err, 'there should be no errors');
									assert.equal(
										res.status,
										200,
										'Must be a successful request of status 200'
									);
									assert.equal(
										res.type,
										'text/html',
										'Response type must be plain text'
									);
									assert.isString(res.text, 'Response must be a string');
									assert.equal(
										res.text,
										'missing required field comment',
										`Error received must be 'missing required field comment'`
									);
									done();
								});
						});
				});

				test('Test POST /api/books/[id] with comment, id not in db', function(done) {
					const id = 'id-not-in-db';
					const request = { comment: 'test-comment2' };
					chai
						.request(server)
						.post(`${booksRoute}\\${id}`)
						.send(request)
						.end((err, res) => {
							assert.isNull(err, 'there should be no errors');
							assert.equal(
								res.status,
								200,
								'Must be a successful request of status 200'
							);
							assert.equal(
								res.type,
								'text/html',
								'Response type must be plain text'
							);
							assert.isString(res.text, 'Response must be a string');
							assert.equal(
								res.text,
								'no book exists',
								`Error received must be 'no book exists'`
							);
							done();
						});
				});
			}
		);

		suite('DELETE /api/books/[id] => delete book object id', function() {
			test('Test DELETE /api/books/[id] with valid id in db', function(done) {
				const requestBook = { title: 'test_title5' };
				chai
					.request(server)
					.post(booksRoute)
					.send(requestBook)
					.end((err, res) => {
						assert.isNull(err, 'there should be no errors');
						assert.equal(
							res.status,
							200,
							'Must be a successful request of status 200'
						);

						const id = res.body._id;
						chai
							.request(server)
							.delete(`${booksRoute}\\${id}`)
							.end((err, res) => {
								assert.isNull(err, 'there should be no errors');
								assert.equal(
									res.status,
									200,
									'Must be a successful request of status 200'
								);
								assert.equal(
									res.type,
									'text/html',
									'Response type must be plain text'
								);
								assert.isString(res.text, 'Response must be a string');
								assert.equal(
									res.text,
									'delete successful',
									`Success received must be 'delete successful'`
								);
								done();
							});
					});
			});

			test('Test DELETE /api/books/[id] with  id not in db', function(done) {
				const id = 'id-not-in-db';
				chai
					.request(server)
					.delete(`${booksRoute}\\${id}`)
					.end((err, res) => {
						assert.isNull(err, 'there should be no errors');
						assert.equal(
							res.status,
							200,
							'Must be a successful request of status 200'
						);
						assert.equal(
							res.type,
							'text/html',
							'Response type must be plain text'
						);
						assert.isString(res.text, 'Response must be a string');
						assert.equal(
							res.text,
							'no book exists',
							`Error received must be 'no book exists'`
						);
						done();
					});
			});
		});
	});
});
