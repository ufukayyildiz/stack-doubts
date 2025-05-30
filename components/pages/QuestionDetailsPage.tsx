import React from 'react';
import { getQuestionById } from '@/lib/actions/question.action';
import { TbClockHour2, TbEye, TbMessageCircle } from 'react-icons/tb';

import ParseHTML from '../partials/ParseHtml';
import AnswerForm from '../forms/AnswerForm';
import QuestionInteractions from '../partials/QuestionInteractions';
import StackyAIAnswer from '../partials/StackyAIAnswer';
import { timeAgo } from '@/utils/data-manipulation';
import Link from 'next/link';

interface Props {
  id: string;
  mongoUserId: string;
}

const QuestionDetailsPage = async ({ id, mongoUserId }: Props) => {
  const question = await getQuestionById(id);
  const sendMailRequiredArgs = {
    title: question?.title,
    author: question?.author?.email,
  };

  return (
    <div className="mt-8 pb-24 lg:pb-14">
      <div className="flex justify-between mb-2">
        <Link
          href={`/profile/${question?.author?._id}`}
          className="flex items-center justify-center"
        >
          <img
            src={question?.author?.picture}
            className="h-6 mr-2 rounded-full"
            alt={`Profile of ${question?.author?.name}`}
          />
          <div className="text-base md:text-lg font-medium mr-4 hover:underline transition duration-200">
            {question?.author?.name}
          </div>
        </Link>
        <QuestionInteractions
          userId={mongoUserId}
          question={JSON.stringify(question)}
        />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold ">{question?.title}</h2>
      <div className="flex items-center justify-between"></div>
      <div className="text-gray-600 dark:text-gray-400 mt-4 flex gap-4">
        <div className=" flex items-center gap-1">
          <TbClockHour2 className="text-base" />
          <div className="text-sm">
            {question?.createdAt && timeAgo(question?.createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TbEye className="text-base" />
          <div className="text-sm">{question?.views} Views</div>
        </div>
        <div className="hidden sm:flex  items-center gap-1">
          <TbMessageCircle className="text-base" />
          <div className="text-sm">{question?.answers?.length} Answers</div>
        </div>
      </div>

      <ParseHTML code={question?.content || ''}></ParseHTML>
      <StackyAIAnswer title={question?.title} content={question?.content} />
      <div className="my-8 font-semibold text-lg  p-2 rounded-full w-fit text-green-800 dark:text-green-300">
        {question?.answers?.length} Answers
      </div>
      {/* render all the answers here */}
      {question?.answers?.map(async (answer) => {
        return (
          <div key={answer?._id} className="mb-8">
            <div className="flex gap-2">
              {/* @ts-ignore */}
              <img src={answer?.author?.picture} className="h-5 rounded-full" />
              {/* @ts-ignore */}
              <div className="font-medium text-sm">{answer.author?.name}</div>
              <div className="text-gray-500 text-sm">
                ‣ Answered {timeAgo(answer?.createdAt)}
              </div>
            </div>
            <ParseHTML code={answer?.content} />
          </div>
        );
      })}
      <div className="text-xl font-bold">Write your answer here</div>
      <AnswerForm
        id={id}
        mongoUserId={mongoUserId}
        question={sendMailRequiredArgs}
      />
    </div>
  );
};

export default QuestionDetailsPage;

