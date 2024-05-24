import { prisma } from "../utils/prisma/prisma.util.js";
import ErrorHandler from "../utils/errorHandler/errorHandler.js";
import STATUS_CODES from "../utils/statusCode.js";

// 해당 유저가 작성한 이력서가 있는지 확인하는함수
// export const checkResumeExist = async (userId) => {
//   const isExistResume = await prisma.resume.findFirst({ where: { user_id: userId } });
//   if (isExistResume) throw new ErrorHandler(409, "이미 작성한 이력서가 존재합니다.");
// };

//이력서를 생성합니다.
export const createUserResume = async (resumeData, userId) => {
  const newResume = await prisma.resume.create({
    data: {
      user_id: userId,
      title: resumeData.title,
      content: resumeData.content
    }
  });
  return newResume;
};
// 유저의 모든 이력서를 가져옵니다 orderBy가 존재하지않다면 기본값 = desc
export const getResumesByUserId = async (userId, orderBy) => {
  const resumes = await prisma.resume.findMany({
    where: { user_id: userId },
    select: {
      resume_id: true,
      title: true,
      content: true,
      status: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          user_info: {
            select: {
              username: true
            }
          }
        }
      }
    },
    orderBy: { created_at: orderBy }
  });
  if (!resumes || resumes.length === 0) {
    return [];
  }

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
//모든 유저의 이력서를 가져옵니다 FOR RECRUITER
export const getAllResumesForRECRUITER = async (orderBy, status) => {
  const statusFilter = status ? { status: status } : {};
  const resumes = await prisma.resume.findMany({
    where: { ...statusFilter },
    select: {
      resume_id: true,
      title: true,
      content: true,
      status: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          user_info: {
            select: {
              username: true
            }
          }
        }
      }
    },
    orderBy: { created_at: orderBy }
  });
  if (!resumes || resumes.length === 0) {
    return [];
  }

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
//하나의 이력서를 가져옵니다.
export const getResumeForAPPLICANTByResumeId = async (userId, resumeId) => {
  const resume = await prisma.resume.findFirst({
    where: { user_id: userId, resume_id: resumeId },
    select: {
      resume_id: true,
      title: true,
      content: true,
      status: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          user_info: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });
  if (!resume) {
    throw new ErrorHandler(404, "이력서가 존재하지 않습니다.");
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
//특정 이력서를 가져옵니다 For Recruiter
export const getResumeForRECRUITERByResumeId = async (resumeId) => {
  const resume = await prisma.resume.findFirst({
    where: { resume_id: resumeId },
    select: {
      resume_id: true,
      title: true,
      content: true,
      status: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          user_info: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });
  if (!resume) {
    throw new ErrorHandler(404, "이력서가 존재하지 않습니다.");
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

//이력서를 수정합니다.
export const updateResumeByResumeId = async (userId, resumeId, updateData) => {
  const resume = await prisma.resume.findFirst({
    where: { user_id: userId, resume_id: resumeId }
  });

  if (!resume) {
    throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
  }
  console.log(updateData.content !== undefined);
  const updateFields = {};
  if (updateData.title !== undefined) {
    updateFields.title = updateData.title;
  }
  if (updateData.content !== undefined) {
    updateFields.content = updateData.content;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new ErrorHandler(STATUS_CODES.BAD_REQUEST, "수정할 정보가 없습니다.");
  }

  const updatedResume = await prisma.resume.update({
    where: { resume_id: resumeId },
    data: updateFields
  });

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

//이력서를 삭제합니다
export const deleteResumeByResumeId = async (userId, resumeId) => {
  const resume = await prisma.resume.findFirst({
    where: { user_id: userId, resume_id: resumeId }
  });
  if (!resume) {
    throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
  }
  await prisma.resume.delete({
    where: { user_id: userId, resume_id: resumeId }
  });
  return resumeId;
};

//이력서의 상태를 수정합니다 For Recruiter
export const updateResumeStatusForRECRUITER = async (userId, resumeId, updateData) => {
  const resume = await prisma.resume.findFirst({ where: { resume_id: resumeId } });
  if (!resume) {
    throw ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
  }
  return await prisma.$transaction(async (tx) => {
    const updatedResume = await tx.resume.update({
      where: { resume_id: resumeId },
      data: {
        status: updateData.status
      }
    });
    const createResumeUpdateLog = await tx.resume_status_change_log.create({
      data: {
        resume_id: resumeId,
        changed_by: userId,
        reason: updateData.reason,
        previous_status: resume.status,
        new_status: updateData.status
      }
    });
    return createResumeUpdateLog;
  });
};

//이력서 변경 이력을 조회합니다 For Recruiter
export const getUpdatedResumeLogForRECRUITER = async (resumeId) => {
  const resume = await prisma.resume.findFirst({ where: { resume_id: resumeId } });
  if (!resume) {
    throw new ErrorHandler(STATUS_CODES.NOT_FOUND, "이력서가 존재하지 않습니다.");
  }
  const resumeLogs = await prisma.resume_status_change_log.findMany({
    where: { resume_id: resumeId },
    select: {
      log_id: true,
      resume_id: true,
      previous_status: true,
      new_status: true,
      reason: true,
      created_at: true,
      users: {
        select: {
          user_info: {
            select: {
              username: true
            }
          }
        }
      }
    },
    orderBy: { created_at: "desc" }
  });
  if (!resumeLogs || resumeLogs.length === 0) {
    return [];
  }

  const formattedData = resumeLogs.map((resume) => ({
    log_id: resume.log_id,
    resume_id: resume.resume_id,
    changed_by: resume.user.user_info.username,
    previous_status: resume.previous_status,
    new_status: resume.new_status,
    reason: resume.reason,
    created_at: resume.created_at
  }));
  return formattedData;
};
