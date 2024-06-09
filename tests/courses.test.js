const mongoose = require('mongoose')
const Course = require("../models/Course")
const request = require("supertest");
const server = require('../app')
const { generateToken } = require('../utils/generateToken')

beforeEach(async () => {

    await Course.deleteMany()
})

afterAll(async () => {

    await mongoose.disconnect()

})
describe.skip('getAllCourses', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should return status 200 and get courses from db', async () => {
        await Course.create({ title: 'new course', price: 55 })
        const res = await request(server).get(`/api/courses`)
        expect(res.status).toBe(200)
        expect(res.body.status).toMatch('success')
        expect(res.body.data.courses[0]).toMatchObject({ title: 'new course', price: 55 })
    })

})



describe.skip('createCourse', () => {
    it('should return 201 status and create course ', async () => {
        const token = await generateToken({ email: 'test@gmail.com', id: "60c4a2a1c433e75c30c3a782", role: 'MANAGER' })
        const res = await request(server).post(`/api/courses`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'new course', price: 70 });
        expect(res.status).toBe(201)
        expect(res.body.status).toMatch('success')
        expect(res.body.data.course).toMatchObject({ title: 'new course', price: 70 })

    })
})



describe.skip('getCourse', () => {
    it('should return status 200 and get course from db', async () => {
        const course = await Course.create({ title: 'new course', price: 100 })
        const res = await request(server).get(`/api/courses/${course._id}`)
        expect(res.status).toBe(200)
        expect(res.body.status).toMatch('success')
        expect(res.body.data.course).toMatchObject({ title: 'new course', price: 100 })
    })
})



describe.skip('updateCourse', () => {
    it('should return status 404 if course not found', async () => {
        const token = await generateToken({ email: 'test@gmail.com', id: "60c4a2a1c433e75c30c3a782", role: 'MANAGER' })
        const res = await request(server).patch(`/api/courses/664c6706b5578e322ac37df5`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
        expect(res.body.status).toMatch('fail')
    })

    it('should return status 200 and update the course', async () => {
        const token = await generateToken({ email: 'test@gmail.com', id: "60c4a2a1c433e75c30c3a782", role: 'MANAGER' })

        const course = await Course.create({ title: 'new course', price: 200 })
        const res = await request(server).patch(`/api/courses/${course._id}`).set('Authorization', `Bearer ${token}`).send({ title: 'updated book' })
        expect(res.status).toBe(200)
        expect(res.body.status).toMatch("success")
        expect(res.body.data.course).toMatchObject({ title: 'updated book' })
    })
})



describe.skip('deleteCourse', () => {
    it('should return status 404 if course not found', async () => {
        const token = await generateToken({ email: 'test@gmail.com', id: "60c4a2a1c433e75c30c3a782", role: 'MANAGER' })
        const res = await request(server).delete(`/api/courses/664c6706b5578e322ac37df5`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
        expect(res.body.status).toMatch('fail')
    })

    it('should return status 204 and delete the course', async () => {
        const token = await generateToken({ email: 'test@gmail.com', id: "60c4a2a1c433e75c30c3a782", role: 'MANAGER' })

        const course = await Course.create({ title: 'new course', price: 200 })
        const res = await request(server).delete(`/api/courses/${course._id}`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)


    })
})