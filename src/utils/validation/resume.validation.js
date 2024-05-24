import Joi from "joi";

export const resumeValidation = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    "string.base": `제목은 문자열로 입력해야 합니다.`,
    "string.empty": `제목은 비워둘 수 없습니다.`,
    "string.min": `제목은 최소 3자 이상이어야 합니다.`,
    "string.max": `제목은 최대 50자까지 가능합니다.`,
    "any.required": `제목 정보는 필수입니다.`
  }),

  content: Joi.string().min(150).required().messages({
    "string.base": `문자열로 입력해주셔야 합니다.`,
    "string.empty": `자기소개 는 150 글자이상 작성해주셔야 합니다.`,
    "string.min": `자기소개 는 150 글자이상 작성해주셔야 합니다.`,
    "any.required": `자기소개 정보는 필수입니다.`
  })
});
export const updateResumeValidation = Joi.object({
  title: Joi.string().min(3).max(50).messages({
    "string.base": `제목은 문자열로 입력해야 합니다.`,
    "string.empty": `제목은 비워둘 수 없습니다.`,
    "string.min": `제목은 최소 3자 이상이어야 합니다.`,
    "string.max": `제목은 최대 50자까지 가능합니다.`
  }),

  content: Joi.string().min(150).messages({
    "string.base": `문자열로 입력해주셔야 합니다.`,
    "string.empty": `자기소개 는 150 글자이상 작성해주셔야 합니다.`,
    "string.min": `자기소개 는 150 글자이상 작성해주셔야 합니다.`
  })
})
  .or("title", "content")
  .messages({
    "object.missing": `수정 할 정보를 입력해 주세요.`
  });
