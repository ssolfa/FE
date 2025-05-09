'use client';

import { hasUserId } from '@/app/api/userUtils';
import ErrorToast from '@/components/ErrorToast';
import locationTracker from '@/hooks/locationTracker';
import { useEffect, useState } from 'react';

export default function LocationTrackerProvider({ children }: { children: React.ReactNode }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    if (hasUserId()) {
      console.log('사용자 ID가 있습니다. 위치 추적을 시작합니다.');
      locationTracker.setNoNearbyBusStopsCallback((message) => {
        setErrorMessage(message);
        setShowErrorToast(true);
      });
      locationTracker.startTracking();
    } else {
      console.log('사용자 ID가 없습니다. 버스 번호 등록이 필요합니다.');
    }

    return () => {
      // 애플리케이션이 완전히 닫힐 때 추적 중지 할 건지... 켜도 다시 남아있게 할 건지 고민
      // locationTracker.stopTracking();
    };
  }, []);

  const handleCloseErrorToast = () => {
    setShowErrorToast(false);
  };

  return (
    <>
      {children}
      {showErrorToast && (
        <ErrorToast
          message="주변에 정류장이 없습니다"
          description={errorMessage}
          onClose={handleCloseErrorToast}
          isVisible={showErrorToast}
        />
      )}
    </>
  );
}
