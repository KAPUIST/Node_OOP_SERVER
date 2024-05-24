import { asyncErrorHandler } from "../middlewares/asyncError.middleware.js";
import STATUS_CODES from "../utils/statusCode.js";
import { resumeValidation } from "../utils/validation/resume.validation.js";
import {
  createUserResume,
  getResumesByUserId,
  getResumeByUserId,
  updateResumeByResumeId,
  deleteResumeByResumeId
} from "../services/resume.service.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";

//유저 생성 컨트롤러
export const createResume = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const validateData = await resumeValidation.validateAsync(req.body);
    // 이미작성한 이력서가 있는지 확인.
    // await checkResumeExist(userId);
    //이력서 생성.
    const resume = await createUserResume(validateData, userId);
    res.status(STATUS_CODES.CREATED).json({
      statusCode: STATUS_CODES.CREATED,
      data: resume
    });
  } catch (error) {
    next(error);
  }
});
//유저 아이디로 모든 Resume 가져와 버리기
export const getResumes = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    //쿼리값이 존재 하지 않을때 기본값 desc 로 설정

    const { sort = "desc" } = req.query;
    const orderBy = sort.toLowerCase() === "asc" ? "asc" : "desc";

    const resumes = await getResumesByUserId(userId, orderBy);
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: resumes
    });
  } catch (error) {
    next(error);
  }
});
//유저 아이디로 Resume 가져와 버리기
export const getResume = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { resumeId } = req.params;
    const resume = await getResumeByUserId(userId, resumeId);
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: resume
    });
  } catch (error) {
    next(error);
  }
});

//이력서 업데이트
export const updateResume = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { resumeId } = req.params;
    const updateData = req.body;
    if (!userId || !resumeId || !updateData) {
      throw new ErrorHandler(400, "잘못된 요청입니다.");
    }
    const updatedResume = await updateResumeByResumeId(
      userId,
      resumeId,
      updateData
    );
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: updatedResume
    });
  } catch (error) {
    next(error);
  }
});

//이력서 삭제
export const deleteResume = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { resumeId } = req.params;

    const deletedResumeId = await deleteResumeByResumeId(userId, resumeId);
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      deletedResumeId
    });
  } catch (error) {
    next(error);
  }
});
