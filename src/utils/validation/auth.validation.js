import Joi from "joi";
export const registerValidation = Joi.object({
  username: Joi.string().min(3).max(10).required().messages({
    "string.base": `문자열로 입력해주셔야 합니다.`,
    "string.empty": `username 은 3 글자이상 작성해주셔야 합니다.`,
    "string.min": `username 은 3 글자이상 작성해주셔야 합니다.`,
    "string.max": `username 은 20 글자이상 작성 할수 없습니다.`,
    "any.required": `username 을 입력해 주세요.`
  }),
  email: Joi.string().email().min(3).max(50).required().messages({
    "string.base": `이메일은 문자열로 입력해야 합니다.`,
    "string.email": `유효한 이메일 주소를 입력해야 합니다.`,
    "string.empty": `이메일은 비워둘 수 없습니다.`,
    "string.min": `이메일은 최소 3자 이상이어야 합니다.`,
    "string.max": `이메일은 최대 50자까지 가능합니다.`,
    "any.required": `이메일 정보는 필수입니다.`
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.base": `문자열로 입력해주셔야 합니다.`,
    "string.empty": `password 는 6 글자이상 작성해주셔야 합니다.`,
    "string.min": `password 는 6 글자이상 작성해주셔야 합니다.`,
    "string.max": `password 는 50 글자이상 작성 할수 없습니다.`,
    "any.required": `password 정보는 필수입니다.`
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": `입력 한 두 비밀번호가 일치하지 않습니다.`,
    "any.required": `비밀번호 확인 정보는 필수입니다.`
  }),
  age: Joi.number().integer().min(1).max(120).required().messages({
    "number.base": `나이는 숫자로 입력해야 합니다.`,
    "number.integer": `나이는 정수로 입력해야 합니다.`,
    "number.min": `나이는 최소 1살 이상이어야 합니다.`,
    "number.max": `나이는 최대 120살 이하이어야 합니다.`,
    "any.required": `나이 정보는 필수입니다.`
  }),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "string.base": `성별은 문자열로 입력해야 합니다.`,
    "any.only": `성별은 'male', 'female', 'other' 중 하나여야 합니다.`,
    "any.required": `성별 정보는 필수입니다.`
  })
});

export const loginValidation = Joi.object({
  email: Joi.string().email().min(3).max(50).required().messages({
    "string.base": `이메일은 문자열로 입력해야 합니다.`,
    "string.email": `이메일 형식이 올바르지 않습니다.`,
    "string.empty": `이메일은 비워둘 수 없습니다.`,
    "string.min": `이메일은 최소 3자 이상이어야 합니다.`,
    "string.max": `이메일은 최대 50자까지 가능합니다.`,
    "any.required": `이메일 정보는 필수입니다.`
  }),

  password: Joi.string().min(6).max(50).required().messages({
    "string.base": `문자열로 입력해주셔야 합니다.`,
    "string.empty": `password 는 6 글자이상 작성해주셔야 합니다.`,
    "string.min": `password 는 6 글자이상 작성해주셔야 합니다.`,
    "string.max": `password 는 50 글자이상 작성 할수 없습니다.`,
    "any.required": `password 정보는 필수입니다.`
  })
});
