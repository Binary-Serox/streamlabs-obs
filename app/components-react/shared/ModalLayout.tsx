import React, { ReactNode, CSSProperties } from 'react';
import { useOnCreate, useVuex } from '../hooks';
import { Services } from '../service-provider';
import { getOS, OS } from '../../util/operating-systems';
import cx from 'classnames';
import { $t } from '../../services/i18n';
import { Button } from 'antd';
import { ModalProps } from 'antd/lib/modal';

// use props of Modal from the antd lib
type TProps = { children: ReactNode } & Pick<ModalProps, 'footer' | 'onOk' | 'okText'>;

/**
 * A modal layout for showing dialogs
 */
export function ModalLayout(p: TProps) {
  // inject services
  const { WindowsService, CustomizationService } = Services;

  // calculate styles
  const s = useOnCreate(() => {
    const titleHeight = getOS() === OS.Mac ? 22 : 30;
    const footerHeight = 53;
    const wrapperStyles: CSSProperties = {
      height: `calc(100% - ${titleHeight}px)`,
    };
    const bodyStyles: CSSProperties = {
      height: `calc(100% - ${footerHeight}px)`,
    };
    return { wrapperStyles, bodyStyles };
  });

  // define a reactive state
  const v = useVuex(() => ({ currentTheme: CustomizationService.currentTheme }));

  // define a close method for the modal
  function close() {
    WindowsService.actions.closeChildWindow();
  }

  // render template
  function render() {
    return (
      <div className={cx('ant-modal-content', v.currentTheme)} style={s.wrapperStyles}>
        <div className="ant-modal-body" style={s.bodyStyles}>
          {p.children}
        </div>
        <div className="ant-modal-footer">{p.footer || renderDefaultFooter()}</div>
      </div>
    );
  }

  // render a default footer with action buttons
  function renderDefaultFooter() {
    const okText = p.okText && $t('Done');
    return (
      <>
        <Button onClick={close}>{$t('Close')}</Button>
        {p.onOk && (
          <Button onClick={p.onOk} type="primary">
            {okText}
          </Button>
        )}
      </>
    );
  }

  return render();
}