import React, { useState } from 'react';
import { Button, Space, Typography, Alert } from 'antd';
import { FullscreenOutlined, DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PDFViewerProps {
  file: string;
  width?: number;
  height?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, width = 400, height = 500 }) => {
  const [error, setError] = useState<string | null>(null);

  const handleIframeError = () => {
    setError('Unable to display PDF preview. Please download the file to view it.');
  };

  const openInNewTab = () => {
    window.open(file, '_blank');
  };

  if (error) {
    return (
      <Alert
        message="PDF Preview Not Available"
        description={
          <div>
            <p>{error}</p>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              href={file}
              target="_blank"
              style={{ marginTop: '8px' }}
            >
              Download PDF
            </Button>
          </div>
        }
        type="warning"
        showIcon
      />
    );
  }

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <Space>
          <Button
            icon={<FullscreenOutlined />}
            onClick={openInNewTab}
            size="small"
          >
            Open in New Tab
          </Button>
          <Button
            icon={<DownloadOutlined />}
            href={file}
            target="_blank"
            size="small"
          >
            Download
          </Button>
        </Space>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <iframe
          src={file}
          width={width}
          height={height}
          style={{ border: 'none' }}
          title="PDF Preview"
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
