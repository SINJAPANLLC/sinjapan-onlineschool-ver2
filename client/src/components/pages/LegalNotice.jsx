import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Building2, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

const LegalNotice = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                            data-testid="button-back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Scale className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">法的情報</h1>
                                <p className="text-sm text-blue-100">Legal Notice</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 max-w-4xl mx-auto pb-8"
            >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                    <h1 className="text-3xl font-bold text-blue-600 mb-6">
                        運営者情報
                    </h1>

                    <div className="space-y-6">
                        {/* サービス名 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">サービス名</h2>
                            <p className="text-gray-700 text-lg">SIN JAPAN ONLINE SCHOOL</p>
                        </div>

                        {/* 運営会社 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                運営会社
                            </h2>
                            <p className="text-gray-700 text-lg font-semibold">合同会社SIN JAPAN</p>
                        </div>

                        {/* 所在地 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-blue-600" />
                                所在地
                            </h2>
                            <p className="text-gray-700">
                                〒243-0303<br />
                                神奈川県愛甲郡愛川町中津7287
                            </p>
                        </div>

                        {/* 電話番号 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Phone className="w-6 h-6 text-blue-600" />
                                電話番号
                            </h2>
                            <p className="text-gray-700">050-5526-9906</p>
                            <p className="text-sm text-gray-500 mt-2">
                                ※お電話でのお問い合わせは承っておりません。<br />
                                お問い合わせは下記メールアドレスまでお願いいたします。
                            </p>
                        </div>

                        {/* メールアドレス */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Mail className="w-6 h-6 text-blue-600" />
                                お問い合わせ
                            </h2>
                            <p className="text-gray-700">
                                メールアドレス: <a href="mailto:info@sinjapan.jp" className="text-blue-600 underline hover:text-blue-700 transition-colors cursor-pointer" data-testid="link-email">
                                    info@sinjapan.jp
                                </a>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                営業時間: 平日 10:00〜18:00（土日祝日を除く）
                            </p>
                        </div>

                        {/* ホームページ */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">ホームページ</h2>
                            <p className="text-gray-700">
                                <a href="https://sinjapan.jp" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700 transition-colors cursor-pointer" data-testid="link-website">
                                    https://sinjapan.jp
                                </a>
                            </p>
                        </div>

                        {/* サービス内容 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">サービス内容</h2>
                            <p className="text-gray-700">
                                オンライン学習プラットフォームの運営<br />
                                講師と学生をつなぐ教育サービスの提供
                            </p>
                        </div>

                        {/* 販売価格 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">販売価格</h2>
                            <p className="text-gray-700">各コースページに表示された金額（税込）</p>
                        </div>

                        {/* 支払方法 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                お支払い方法
                            </h2>
                            <p className="text-gray-700">
                                クレジットカード決済、デビットカード決済
                            </p>
                        </div>

                        {/* 支払期限 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">お支払期限</h2>
                            <p className="text-gray-700">コース受講申込時に決済確定</p>
                        </div>

                        {/* サービス提供時期 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">サービスの提供時期</h2>
                            <p className="text-gray-700">お支払い完了後、直ちにコース受講が可能となります。</p>
                        </div>

                        {/* 返品・キャンセル */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">返品・キャンセルについて</h2>
                            <p className="text-gray-700">
                                デジタルコンテンツという商品の性質上、原則として返金・キャンセルはお受けできません。<br />
                                詳細は<a href="/commercial" className="text-blue-600 hover:underline">特定商取引法に基づく表記</a>をご確認ください。
                            </p>
                        </div>

                        {/* 解約条件 */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">サービスの解約条件</h2>
                            <p className="text-gray-700">
                                解約される場合は、サイト上の記載に従って解約手続きを行ってください。
                            </p>
                        </div>
                    </div>

                    {/* リンクセクション */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-6">関連ページ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href="/terms"
                                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border-2 border-blue-200 transition-all"
                            >
                                <h3 className="font-bold text-gray-800 mb-1">利用規約</h3>
                                <p className="text-sm text-gray-600">サービスの利用に関する規約</p>
                            </a>
                            <a
                                href="/privacy"
                                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border-2 border-blue-200 transition-all"
                            >
                                <h3 className="font-bold text-gray-800 mb-1">プライバシーポリシー</h3>
                                <p className="text-sm text-gray-600">個人情報の取り扱いについて</p>
                            </a>
                            <a
                                href="/commercial"
                                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border-2 border-blue-200 transition-all"
                            >
                                <h3 className="font-bold text-gray-800 mb-1">特定商取引法に基づく表記</h3>
                                <p className="text-sm text-gray-600">法定表示事項</p>
                            </a>
                            <a
                                href="/guidelines"
                                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border-2 border-blue-200 transition-all"
                            >
                                <h3 className="font-bold text-gray-800 mb-1">コンテンツガイドライン</h3>
                                <p className="text-sm text-gray-600">コンテンツ投稿の基準</p>
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-600 font-medium">
                            最終更新: 2025年1月1日
                        </p>
                        <p className="text-gray-600 mt-2">
                            合同会社SIN JAPAN
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LegalNotice;
