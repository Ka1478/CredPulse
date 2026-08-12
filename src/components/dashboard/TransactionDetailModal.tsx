import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Transaction } from '../../lib/types';
import { CreditCard, Calendar, MapPin, Receipt, Coins, ShieldCheck } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose
}) => {
  if (!transaction) return null;

  const dt = new Date(transaction.date);
  const statusVariant = transaction.status === 'SUCCESS' ? 'success' : transaction.status === 'PENDING' ? 'pending' : 'failed';

  return (
    <Modal
      isOpen={!!transaction}
      onClose={onClose}
      title="Transaction Details"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Merchant & Amount Hero Header */}
        <div style={{
          backgroundColor: 'rgba(31, 41, 55, 0.6)',
          padding: '16px',
          borderRadius: 'var(--cp-radius-md)',
          border: '1px solid var(--cp-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cp-text-primary)' }}>
              {transaction.merchant_name}
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-muted)', marginTop: '2px' }}>
              Ref: {transaction.txn_ref}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--cp-accent-primary)' }}>
              ₹{transaction.amount_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ marginTop: '4px' }}>
              <Badge variant={statusVariant}>{transaction.status}</Badge>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={18} color="var(--cp-text-muted)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>CATEGORY</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cp-text-primary)', marginTop: '2px' }}>
                {transaction.category_name || 'General'}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="var(--cp-text-muted)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>DATE & TIME</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cp-text-primary)', marginTop: '2px' }}>
                {dt.toLocaleDateString('en-IN')} {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={18} color="var(--cp-text-muted)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>PAYMENT METHOD</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cp-text-primary)', marginTop: '2px' }}>
                {transaction.payment_method} {transaction.card_last4 ? `(••• ${transaction.card_last4})` : ''}
              </p>
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} color="var(--cp-text-muted)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>LOCATION</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cp-text-primary)', marginTop: '2px' }}>
                {transaction.location || 'Online'}
              </p>
            </div>
          </div>

          {/* Coins Earned */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: 'span 2' }}>
            <Coins size={18} color="#F59E0B" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>REWARD COINS EARNED</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FBBF24', marginTop: '2px' }}>
                +{transaction.reward_coins_earned} CredCoins (1 coin per ₹100 spent)
              </p>
            </div>
          </div>
        </div>

        {/* Description / Memo */}
        {transaction.description && (
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--cp-border-subtle)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>DESCRIPTION</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--cp-text-secondary)', marginTop: '4px' }}>
              {transaction.description}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
