import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import STATUS_CODES from "../utils/statusCode.js";

export default class ResumeService {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }
  findResumeByResumeId = async (resumeId) => {
    const resume = await this.resumeRepository.findResumeByResumeId(resumeId);
    if (!resume) {
      return;
    }
    return resume;
  };
  //이력서 찾기
  findResumeByUserIdAndResumeId = async (userId, resumeId) => {
    const resume = await this.resumeRepository.findResumeByUserIdAndResumeId(userId, resumeId);

    if (!resume) {
      return;
    }
    return resume;
  };
  //이력서생성
  createResume = async (userId, resumeData) => {
    const resume = this.resumeRepository.createResume(userId, resumeData);
    return resume;
  };
  //특정 유저가 작성한 모든이력서
  findResumesByUserId = async (userId, orderBy) => {
    const resumes = await this.resumeRepository.findResumesByUserId(userId, orderBy);

    if (resumes.length === 0) return [];
    console.log(resumes);
    const formattedData = resumes.map((resume) => ({
      resume_id: resume.resume_id,
      username: resume.user.user_info.username,
      title: resume.title,
      status: resume.status,
      content: resume.content,
      created_at: resume.created_at,
      updated_at: resume.updated_at
    }));

    return formattedData;
  };
  //등록된 모든이력서
  findAllResumesForRECRUITER = async (orderBy, status) => {
    const statusFilter = status ? { status: status } : {};
    const resumes = await this.resumeRepository.findAllResumesForRECRUITER(orderBy, statusFilter);

    if (resumes.length === 0) return [];

    const formattedData = resumes.map((resume) => ({
      resume_id: resume.resume_id,
      username: resume.user.user_info.username,
      title: resume.title,
      status: resume.status,
      content: resume.content,
      created_at: resume.created_at,
      updated_at: resume.updated_at
    }));
    return formattedData;
  };
  //특정유저가 작성한 특정 이력서
  findResumeForAPPLICANTByResumeId = async (userId, resumeId) => {
    const resume = await this.resumeRepository.findResumeForAPPLICANTByResumeId(userId, resumeId);

    if (!resume) {
      throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
    }
    const formattedData = {
      resume_id: resume.resume_id,
      username: resume.user.user_info.username,
      title: resume.title,
      status: resume.status,
      content: resume.content,
      created_at: resume.created_at
    };

    return formattedData;
  };
  //특정이력서 가져오기
  findResumeForRECRUITERByResumeId = async (resumeId) => {
    const resume = await this.resumeRepository.findResumeForRECRUITERByResumeId(resumeId);
    if (!resume) {
      throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
    }
    const formattedData = {
      resume_id: resume.resume_id,
      username: resume.user.user_info.username,
      title: resume.title,
      status: resume.status,
      content: resume.content,
      created_at: resume.created_at
    };
    return formattedData;
  };
  //이력서 업데이트하기
  updateResumeByResumeId = async (resumeId, updateData) => {
    let updateFields = {};
    if (updateData.title !== undefined) {
      updateFields.title = updateData.title;
    }
    if (updateData.content !== undefined) {
      updateFields.content = updateData.content;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "수정할 정보가 없습니다.");
    }
    const updatedResume = await this.resumeRepository.updateResumeByResumeId(resumeId, updateData);
    return {
      resume_id: updatedResume.resume_id,
      user_id: updatedResume.user_id,
      title: updatedResume.title,
      content: updatedResume.content,
      status: updatedResume.status,
      createdAt: updatedResume.created_at,
      updatedAt: updatedResume.updated_at
    };
  };
  //이력서 삭제하기
  deleteResumeByResumeId = async (userId, resumeId) => {
    const result = await this.resumeRepository.deleteResumeByResumeId(userId, resumeId);
    return result;
  };
  //이력서 상태변경 및 로그 작성
  updateResumeStatusForRECRUITER = async (userId, resumeId, updateData) => {
    return await this.resumeRepository.updateResumeStatusForRECRUITERTx(userId, resumeId, updateData);
  };
  //이력서 상태 변결 로그 조회
  getUpdatedResumeLogForRECRUITER = async (resumeId) => {
    const resumeLogs = await this.resumeRepository.getUpdatedResumeLogForRECRUITER(resumeId);
    if (resumeLogs.length === 0) {
      return [];
    }

    const formattedData = resumeLogs.map((resume) => ({
      log_id: resume.log_id,
      resume_id: resume.resume_id,
      changed_by: resume.users.user_info.username,
      previous_status: resume.previous_status,
      new_status: resume.new_status,
      reason: resume.reason,
      created_at: resume.created_at
    }));
    return formattedData;
  };
}
