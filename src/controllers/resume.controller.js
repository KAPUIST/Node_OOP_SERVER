import { RESUME_STATUS } from "../constants/env.constant.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import STATUS_CODES from "../utils/statusCode.js";

export default class ResumeController {
  constructor(resumeService) {
    this.resumeService = resumeService;
  }
  createResume = async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const resumeData = req.body;

      const resume = await this.resumeService.createResume(userId, resumeData);
      res.status(STATUS_CODES.CREATED).json({
        data: resume
      });
    } catch (error) {
      next(error);
    }
  };
  //특정유저의 모든 이력서 가져오기
  findAllResumesForAPPLICANT = async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { sort = "desc" } = req.query;
      const orderBy = sort.toLowerCase() === "asc" ? "asc" : "desc";
      const resumes = await this.resumeService.findResumesByUserId(userId, orderBy);
      res.status(STATUS_CODES.OK).json({
        data: resumes
      });
    } catch (error) {
      next(error);
    }
  };
  //모든 유저의 이력서 가져오기
  findAllResumesForRECRUITER = async (req, res, next) => {
    try {
      const { sort = "desc", status } = req.query;
      const isValidStatus = !status || Object.values(RESUME_STATUS).includes(status);
      if (!isValidStatus) {
        throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "잘못된 요청입니다.");
      }
      const orderBy = sort.toLowerCase() === "asc" ? "asc" : "desc";
      const resumes = await this.resumeService.findAllResumesForRECRUITER(orderBy, status);
      res.status(STATUS_CODES.OK).json({
        data: resumes
      });
    } catch (error) {
      next(error);
    }
  };
  //특정유저의 특정 이력서 가져오기
  findResumeForAPPLICANTByResumeId = async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { resumeId } = req.params;
      const resume = await this.resumeService.findResumeForAPPLICANTByResumeId(userId, resumeId);
      res.status(STATUS_CODES.OK).json({
        data: resume
      });
    } catch (error) {
      next(error);
    }
  };
  //특정이력서 가져오기
  findResumeForRECRUITERByResumeId = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const resume = await this.resumeService.findResumeForRECRUITERByResumeId(resumeId);
      res.status(STATUS_CODES.OK).json({
        data: resume
      });
    } catch (error) {
      next(error);
    }
  };
  //이력서 업데이트
  updateResume = async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { resumeId } = req.params;
      let updateData = req.body;
      if (!userId || !resumeId || !updateData) {
        throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "잘못된 요청입니다.");
      }
      const resume = await this.resumeService.findResumeByUserIdAndResumeId(userId, resumeId);
      if (!resume) {
        throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
      }

      const updatedResume = await this.resumeService.updateResumeByResumeId(resumeId, updateData);

      res.status(STATUS_CODES.OK).json({
        data: updatedResume
      });
    } catch (error) {
      next(error);
    }
  };
  //이력서 삭제
  deleteResume = async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { resumeId } = req.params;
      const resume = await this.resumeService.findResumeByUserIdAndResumeId(userId, resumeId);
      if (!resume) {
        throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
      }
      const deletedResumeId = await this.resumeService.deleteResumeByResumeId(userId, resumeId);
      res.status(STATUS_CODES.OK).json({
        resumeId
      });
    } catch (error) {
      next(error);
    }
  };
  //이력서 상태 업데이트
  updateResumeStatus = async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const { resumeId } = req.params;
      let updateData = req.body;
      const resume = await this.resumeService.findResumeByUserIdAndResumeId(userId, resumeId);
      if (!resume) {
        throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
      }

      updateData = { ...updateData, prevStatus: resume.status };
      const updatedResumeLog = await this.resumeService.updateResumeStatusForRECRUITER(userId, resumeId, updateData);

      res.status(STATUS_CODES.OK).json({
        data: {
          updatedResumeLog
        }
      });
    } catch (error) {
      next(error);
    }
  };
  //이력서 상태 업데이트 로그조회
  getUpdatedResumeLog = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      if (!resumeId) {
        throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "잘못된 요청입니다.");
      }
      const resume = await this.resumeService.findResumeByResumeId(resumeId);
      if (!resume) {
        throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
      }
      const resumeLogs = await this.resumeService.getUpdatedResumeLogForRECRUITER(resumeId);
      res.status(STATUS_CODES.OK).json({
        data: resumeLogs
      });
    } catch (error) {
      next(error);
    }
  };
}
