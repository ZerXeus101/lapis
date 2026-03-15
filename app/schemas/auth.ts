import * as v from 'valibot'

export const loginSchema = v.object({
  email: v.pipe(
    v.string(), 
    v.nonEmpty('Email is required'), 
    v.email('Invalid email address')
  ),
  password: v.pipe(
    v.string(), 
    v.nonEmpty('Password is required'), 
    v.minLength(6, 'Password must be at least 6 characters')
  )
})

export const registerSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(), 
      v.nonEmpty('Email is required'), 
      v.email('Invalid email address')
    ),
    password: v.pipe(
      v.string(), 
      v.nonEmpty('Password is required'), 
      v.minLength(6, 'Password must be at least 6 characters')
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty('Please confirm your password')
    )
  }),
  v.forward(
    v.partialCheck(
      ['password', 'confirmPassword'],
      (input) => input.password === input.confirmPassword,
      'Passwords do not match'
    ),
    ['confirmPassword']
  )
)

export type LoginInput = v.InferInput<typeof loginSchema>
export type RegisterInput = v.InferInput<typeof registerSchema>
