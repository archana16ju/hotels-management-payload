'use client';

import React from 'react';
import { Button, useDocumentInfo, useFormFields } from '@payloadcms/ui';
import { v4 as uuidv4 } from 'uuid';

export const ProductActionButton: React.FC = () => {

  const { id, collectionSlug } = useDocumentInfo();

  const formFields = useFormFields(([fields, dispatch]) => ({
    fields,
    dispatch,
  }));

  const productBarcode =
    formFields?.fields?.productBarcode?.value;

  const active =
    formFields?.fields?.active?.value;

  const handleGenerateBarcode = () => {

    const barcode = `PRD-${uuidv4().slice(0, 8).toUpperCase()}`;

    formFields.dispatch({
      type: 'UPDATE',
      path: 'productBarcode',
      value: barcode,
    });

    alert(`Barcode Generated: ${barcode}`);
  };

  const handleToggleActive = () => {

    formFields.dispatch({
      type: 'UPDATE',
      path: 'active',
      value: !active,
    });

    alert(`Product is now ${!active ? 'Active' : 'Inactive'}`);
  };

  const handleShowBarcode = () => {

    if (!productBarcode) {
      alert('No barcode generated');
      return;
    }

    alert(`Product Barcode: ${productBarcode}`);
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>

      <Button onClick={handleGenerateBarcode}>
        Generate Barcode
      </Button>

      <Button onClick={handleToggleActive}>
        {active ? 'Deactivate' : 'Activate'}
      </Button>

      <Button onClick={handleShowBarcode}>
        Show Barcode
      </Button>

    </div>
  );
};