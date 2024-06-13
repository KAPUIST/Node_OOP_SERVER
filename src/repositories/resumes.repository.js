export default class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findResumeByResumeId = async (resumeId) => {
    const resume = await this.prisma.resume.findUnique({ where: { resume_id: resumeId } });
    return resume;
  };
  findResumeByUserIdAndResumeId = async (userId, resumeId) => {
    const resume = await this.prisma.resume.findFirst({ where: { user_id: userId, resume_id: resumeId } });

    return resume;
  };
  findResumesByUserId = async (userId, orderBy) => {
    const resumes = await this.prisma.resume.findMany({
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

    return resumes;
  };
  createResume = async (userId, resumeData) => {
    const newResume = await this.prisma.resume.create({
      data: {
        user_id: userId,
        title: resumeData.title,
        content: resumeData.content
      }
    });
    return newResume;
  };
  findAllResumesForRECRUITER = async (orderBy, status) => {
    const resumes = await this.prisma.resume.findMany({
      where: { ...status },
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

    return resumes;
  };
  findResumeForAPPLICANTByResumeId = async (userId, resumeId) => {
    const resume = await this.prisma.resume.findFirst({
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
    return resume;
  };
  findResumeForRECRUITERByResumeId = async (resumeId) => {
    const resume = await this.prisma.resume.findFirst({
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

    return resume;
  };
  updateResumeByResumeId = async (resumeId, updateFields) => {
    const updatedResume = await this.prisma.resume.update({
      where: { resume_id: resumeId },
      data: updateFields
    });
    return updatedResume;
  };
  deleteResumeByResumeId = async (userId, resumeId) => {
    const result = await this.prisma.resume.delete({
      where: { user_id: userId, resume_id: resumeId }
    });
    return result;
  };
  #updateResumeStatusTx = async (resumeId, status, tx) => {
    const updatedResume = await tx.resume.update({
      where: { resume_id: resumeId },
      data: {
        status: status
      }
    });
    return updatedResume;
  };
  #createResumeUpdateLogTx = async (userId, resumeId, updateData, tx) => {
    const { reason, prevStatus, status } = updateData;
    console.log(updateData, "sibal");
    const createResumeUpdateLog = await tx.resume_status_change_log.create({
      data: {
        resume_id: resumeId,
        changed_by: userId,
        reason: reason,
        previous_status: prevStatus,
        new_status: status
      }
    });
    return createResumeUpdateLog;
  };
  updateResumeStatusForRECRUITERTx = async (userId, resumeId, updateData) => {
    return await this.prisma.$transaction(async (tx) => {
      const updatedResume = await this.#updateResumeStatusTx(resumeId, updateData.status, tx);

      const updateLog = await this.#createResumeUpdateLogTx(userId, resumeId, updateData, tx);
      return updateLog;
    });
  };
  getUpdatedResumeLogForRECRUITER = async (resumeId) => {
    const resumeLogs = await this.prisma.resume_status_change_log.findMany({
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
    return resumeLogs;
  };
}
