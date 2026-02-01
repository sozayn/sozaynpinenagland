import React from 'react';
import {
  BrainCircuit,
  X,
  BookOpen,
  Users,
  MessageSquare,
  Clock,
  Sparkles, // Using Sparkles for Yoga/Meditation
  Star,
  Gamepad2, // For Game
  UserCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Plus,
  Trash2,
  LayoutGrid, // For GridIcon
  Shield, // For HnefataflIcon
  Coins, // For MancalaIcon
  Flower2,
  Pause,
  StopCircle,
  Play,
  Volume2,
  VolumeX,
  HelpCircle,
  LogOut,
  type LucideProps,
} from 'lucide-react';

export type { LucideProps };

export const BrainCircuitIcon = (props: LucideProps) => <BrainCircuit {...props} />;
export const XIcon = (props: LucideProps) => <X {...props} />;
export const BookOpenIcon = (props: LucideProps) => <BookOpen {...props} />;
export const UsersIcon = (props: LucideProps) => <Users {...props} />;
export const MessageSquareIcon = (props: LucideProps) => <MessageSquare {...props} />;
export const ClockIcon = (props: LucideProps) => <Clock {...props} />;
export const YogaIcon = (props: LucideProps) => <Sparkles {...props} />;
export const StarIcon = (props: LucideProps) => <Star {...props} />;
export const GameIcon = (props: LucideProps) => <Gamepad2 {...props} />;
export const UserCircleIcon = (props: LucideProps) => <UserCircle {...props} />;
export const CheckCircleIcon = (props: LucideProps) => <CheckCircle {...props} />;
export const ChevronRightIcon = (props: LucideProps) => <ChevronRight {...props} />;
export const ChevronLeftIcon = (props: LucideProps) => <ChevronLeft {...props} />;
export const SendIcon = (props: LucideProps) => <Send {...props} />;
export const PlusIcon = (props: LucideProps) => <Plus {...props} />;
export const Trash2Icon = (props: LucideProps) => <Trash2 {...props} />;
export const GridIcon = (props: LucideProps) => <LayoutGrid {...props} />;
export const HnefataflIcon = (props: LucideProps) => <Shield {...props} />;
export const MancalaIcon = (props: LucideProps) => <Coins {...props} />;
export const LotusIcon = (props: LucideProps) => <Flower2 {...props} />;
export const PauseIcon = (props: LucideProps) => <Pause {...props} />;
export const StopCircleIcon = (props: LucideProps) => <StopCircle {...props} />;
export const PlayIcon = (props: LucideProps) => <Play {...props} />;
export const Volume2Icon = (props: LucideProps) => <Volume2 {...props} />;
export const VolumeXIcon = (props: LucideProps) => <VolumeX {...props} />;
export const HelpCircleIcon = (props: LucideProps) => <HelpCircle {...props} />;
export const LogOutIcon = (props: LucideProps) => <LogOut {...props} />;
// Added SparklesIcon to allow components to use it specifically.
export const SparklesIcon = (props: LucideProps) => <Sparkles {...props} />;