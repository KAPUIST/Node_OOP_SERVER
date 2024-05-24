import { asyncErrorHandler } from "../middlewares/asyncError.middleware.js";
import STATUS_CODES from "../utils/statusCode.js";
import {
  resumeValidation,
  updateResumeStatusValidation,
  updateResumeValidation
} from "../utils/validation/resume.validation.js";
import {
  createUserResume,
  getResumesByUserId,
  updateResumeByResumeId,
  deleteResumeByResumeId,
  getAllResumesForRECRUITER,
  getResumeForRECRUITERByResumeId,
  getResumeForAPPLICANTByResumeId,
  updateResumeStatusForRECRUITER,
  getUpdatedResumeLogForRECRUITER
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
//유저 아이디로 모든 Resume 가져와 버리기 APPLICANT role 을 가지고있는 유저만
export const getResumesForAPPLICANT = asyncErrorHandler(async (req, res, next) => {
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
//모든 Resume 가져와 버리기 RECRUITER role 을 가지고있는 유저만
export const getResumesForRECRUITER = asyncErrorHandler(async (req, res, next) => {
  try {
    const Status = {
      APPLY: "APPLY",
      DROP: "DROP",
      PASS: "PASS",
      INTERVIEW1: "INTERVIEW1",
      INTERVIEW2: "INTERVIEW2",
      FINAL_PASS: "FINAL_PASS"
    };

    const { sort = "desc", status } = req.query;
    const isValidStatus = !status || Object.values(Status).includes(status);
    if (!isValidStatus) {
      throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "잘못된 요청입니다.");
    }
    const orderBy = sort.toLowerCase() === "asc" ? "asc" : "desc";

    const resumes = await getAllResumesForRECRUITER(orderBy, status);
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: resumes
    });
  } catch (error) {
    next(error);
  }
});
//유저 아이디로 Resume 가져와 버리기
export const getResumeForAPPLICANT = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { resumeId } = req.params;
    const resume = await getResumeForAPPLICANTByResumeId(userId, resumeId);
    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: resume
    });
  } catch (error) {
    next(error);
  }
});
//모든 Resume 가져와 버리기 For RECRUITER
export const getResumeForRECRUITER = asyncErrorHandler(async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const resume = await getResumeForRECRUITERByResumeId(resumeId);
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
    const updateData = await updateResumeValidation.validateAsync(req.body);
    if (!userId || !resumeId || !updateData) {
      throw new ErrorHandler(400, "잘못된 요청입니다.");
    }
    const updatedResume = await updateResumeByResumeId(userId, resumeId, updateData);
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
//이력서 상태 업데이트 For RECRUITER
export const updateResumeStatus = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { resumeId } = req.params;
    const updateData = await updateResumeStatusValidation.validateAsync(req.body);
    const updatedResumeLog = await updateResumeStatusForRECRUITER(userId, resumeId, updateData);

    res.status(STATUS_CODES.OK).json({
      statusCode: STATUS_CODES.OK,
      data: {
        updatedResumeLog
      }
    });
  } catch (error) {
    next(error);
  }
});
//이력서 상태 변경 로그 조회 For RECRUITER
export const getUpdatedResumeLog = asyncErrorHandler(async (req, res, next) => {
  const { resumeId } = req.params;
  if (!resumeId) {
    throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "잘못된 요청입니다.");
  }
  const resumeLogs = await getUpdatedResumeLogForRECRUITER(resumeId);
  res.status(STATUS_CODES.OK).json({
    statusCode: STATUS_CODES.OK,
    data: resumeLogs
  });
});
