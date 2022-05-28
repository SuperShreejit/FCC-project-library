/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../model');

module.exports = function(app) {
	app
		.route('/api/books')
		.get(async function(req, res) {
			//response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			try {
				const books = await Book.find({}).exec();
				res.json(books);
			} catch (error) {
				res.send(error.message);
			}
		})

		.post(async function(req, res) {
			//response will contain new book object including atleast _id and title
			try {
				if (!req.body.title) throw new Error('missing required field title');

				const title = req.body.title;
				const book = new Book({ title });
				const newBook = await book.save();
				res.json(newBook);
			} catch (error) {
				res.send(error.message);
			}
		})

		.delete(async function(req, res) {
			//if successful response will be 'complete delete successful'
			try {
				(await Book.deleteMany()) && res.send('complete delete successful');
			} catch (error) {
				res.send(error.message);
			}
		});

	app
		.route('/api/books/:id')
		.get(async function(req, res) {
			//json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
			const bookId = req.params.id;
			try {
				if (!bookId.match(/^\w{24}$/)) throw new Error('no book exists');
				const book = await Book.findById(bookId);
				if (!book) throw new Error('no book exists');

				res.json(book);
			} catch (error) {
				res.send(error.message);
			}
		})

		.post(async function(req, res) {
			//json res format same as .get
			const bookId = req.params.id;
			try {
				if (!req.body.comment)
					throw new Error('missing required field comment');

				if (!bookId.match(/^\w{24}$/)) throw new Error('no book exists');
				const book = await Book.findById(bookId);
				if (!book) throw new Error('no book exists');

        const comment = req.body.comment
        const updateQuery = { comments: [...book.comments, comment ], commentcount: book.commentcount +1 }
        
				const updatedBook = await Book.findByIdAndUpdate(bookId, updateQuery, { new: true });
				updatedBook && res.json(updatedBook);
			} catch (error) {
				res.send(error.message);
			}
		})

		.delete(async function(req, res) {
			//if successful response will be 'delete successful'
			const bookId = req.params.id;
			try {
				if (!bookId.match(/^\w{24}$/)) throw new Error('no book exists');
				const book = await Book.findById(bookId);
				if (!book) throw new Error('no book exists');

				(await Book.findByIdAndDelete(bookId)) &&
					res.send('delete successful');
			} catch (error) {
				res.send(error.message);
			}
		});
};
