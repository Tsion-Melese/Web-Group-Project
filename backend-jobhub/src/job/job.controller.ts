import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { User, UserType } from '@prisma/client';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobController {
  UserService: any;
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() dto: CreateJobDto) {
    const userId = dto.createrId;

    if (!userId) {
      throw new NotFoundException('User ID not provided');
    }
    const user = await this.jobService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.jobService.createJob(userId, dto);
  }


  @Get()
  async getAllJobs() {
    try {
      const jobs = await this.jobService.getAllJobs();
      return { jobs, success: true };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs', success: false };
    }
  }

  @Get('forEmployees')
  async getJobsForEmployees() {
    try {
      const jobs = await this.jobService.getJobsByUserType(UserType.EMPLOYEE);
      return { success: true, jobs };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs for employees', success: false };
    }
  }

  

  @Get('forJobSeekers')
  async getJobsForJobSeekers() {
    try {
      const jobs = await this.jobService.getJobsByUserType(UserType.JOB_SEEKER);
      return { success: true, jobs };
    } catch (error) {
      return { error: 'An error occurred while fetching jobs for job seekers', success: false };
    }
  }

  @Delete(':id')
  async deleteJob(@Param('id') jobId: string) {
    try {
      const result = await this.jobService.deleteJob(jobId);
      return { success: true, message: `Job with ID ${jobId} deleted successfully` };
    } catch (error) {
      return { error: `An error occurred while deleting job with ID ${jobId}`, success: false };
    }}



    @Patch(':id')
   
    async updateJob(@Param('id') jobId: string, @Body() updateJobDto: UpdateJobDto) {
      try {
        const updatedJob = await this.jobService.updateJob(jobId, updateJobDto);
        return { success: true, job: updatedJob };
      } catch (error) {
        return { error: `An error occurred while updating job with ID ${jobId}`, success: false };
      }
  
    }}
