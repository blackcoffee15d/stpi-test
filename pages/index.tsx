import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StockingTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState('');
  const [answers, setAnswers] = useState({
    type: '',
    denier: '',
    toe: '',
    color: '',
    specificColor: ''
  });

  const getResultDescription = (result) => {
    const parts = result.split('-');
    const mainType = parts[0];
    const colorType = parts[1] || '';

    let description = [];

    // Type (P/B)
    description.push(mainType[0] === 'P' ? 
      '팬티스타킹을 선호하는 당신은 전체적인 실루엣을 중요시합니다.' : 
      '밴드스타킹을 선호하는 당신은 포인트가 되는 라인을 중요시합니다.');

    // Denier (T/D)
    description.push(mainType[1] === 'T' ? 
      '얇은 데니어를 선호하여 은은하게 비치는 살결을 매력적으로 느낍니다.' : 
      '두꺼운 데니어를 선호하여 확실한 착용감과 질감을 매력적으로 느낍니다.');

    // Toe (R/N)
    description.push(mainType[2] === 'R' ? 
      '발끝이 강화된 스타일을 선호하여 명확한 라인을 추구합니다.' : 
      '누드톤 발끝을 선호하여 자연스러운 연출을 추구합니다.');

    // Color (S/M)
    if (mainType[3] === 'S') {
      const colorMap = {
        'B': '검정색을 선호하여 시크하고 도시적인 매력을',
        'T': '커피색을 선호하여 차분하고 성숙한 매력을',
        'N': '살구색을 선호하여 자연스럽고 건강한 매력을',
        'W': '흰색을 선호하여 순수하고 청순한 매력을'
      };
      description.push(colorMap[colorType] + ' 추구합니다.');
    } else {
      description.push('다양한 색상을 선호하여 상황에 맞는 유연한 연출을 추구합니다.');
    }

    return description;
  };

  const questions = [
    {
      question: "팬티스타킹과 밴드스타킹 중 더 선호하는 것은?",
      options: [
        { label: "팬티스타킹", value: "P" },
        { label: "밴드스타킹", value: "B" }
      ]
    },
    {
      question: "10-20데니어와 40데니어 이상 중 더 선호하는 것은?",
      options: [
        { label: "10-20데니어의 얇은 타입", value: "T" },
        { label: "40데니어 이상의 두꺼운 타입", value: "D" }
      ]
    },
    {
      question: "발끝 부분이 짙은 것과 누드톤인 것 중 선호하는 것은?",
      options: [
        { label: "짙은 발끝/강화 발끝", value: "R" },
        { label: "누드톤 발끝", value: "N" }
      ]
    },
    {
      question: "특정 색상만 고집하는가?",
      options: [
        { label: "예", value: "S" },
        { label: "아니오", value: "M" }
      ]
    }
  ];

  const colorQuestion = {
    question: "검정, 커피, 살구, 흰색 중 가장 선호하는 색상은?",
    options: [
      { label: "검정", value: "B" },
      { label: "커피", value: "T" },
      { label: "살구", value: "N" },
      { label: "흰색", value: "W" }
    ]
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers };
    
    switch(currentStep) {
      case 0:
        newAnswers.type = answer;
        break;
      case 1:
        newAnswers.denier = answer;
        break;
      case 2:
        newAnswers.toe = answer;
        break;
      case 3:
        newAnswers.color = answer;
        break;
      case 4:
        newAnswers.specificColor = answer;
        break;
    }
    
    setAnswers(newAnswers);

    if (currentStep === 3 && answer === 'M') {
      calculateResult({ ...newAnswers, color: 'M' });
    } else if (currentStep < questions.length - 1 || (currentStep === 3 && answer === 'S')) {
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === 4 || (currentStep === 3 && answer === 'M')) {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    let resultString = finalAnswers.type + 
                      finalAnswers.denier + 
                      finalAnswers.toe + 
                      finalAnswers.color;
    
    if (finalAnswers.color === 'S') {
      resultString += '-' + finalAnswers.specificColor;
    }
    
    setResult(resultString);
  };

  const getCurrentQuestion = () => {
    if (currentStep === 4) {
      return colorQuestion;
    }
    return questions[currentStep];
  };

  const renderQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

    return (
      <div className="space-y-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion.question}</p>
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.value}
                className="w-full h-12 text-lg"
                variant="outline"
                onClick={() => handleAnswer(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const descriptions = getResultDescription(result);

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">당신의 STPI 유형은</h3>
          <p className="text-4xl font-bold text-blue-600">{result}</p>
        </div>
        
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl">유형 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {descriptions.map((desc, index) => (
                <li key={index} className="text-gray-700">
                  {desc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Button 
          onClick={() => {
            setCurrentStep(0);
            setResult('');
            setAnswers({
              type: '',
              denier: '',
              toe: '',
              color: '',
              specificColor: ''
            });
          }}
          className="w-full"
        >
          다시 테스트하기
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">당신의 스타킹 유형 지표 (STPI)</CardTitle>
<CardDescription className="text-lg">Stocking Type Preference Indicator</CardDescription>
        <CardDescription>
          {!result && `Question ${currentStep + 1} of ${questions.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result ? renderResult() : renderQuestion()}
      </CardContent>
    </Card>
  );
};

export default StockingTest;
